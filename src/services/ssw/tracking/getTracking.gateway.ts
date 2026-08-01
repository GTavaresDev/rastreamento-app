import * as cheerio from "cheerio";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getTrackingByCpf } from "@core/domain/tracking/tracking";
import { getTrackingDetailById } from "@core/domain/tracking/tracking-detail";
import type { ScraperError, SswFormFields } from "@/types";
import { REQUEST_TIMEOUT_MS, SSW_BASE_URL, SSW_TRACKING_URL } from "@/utils/constants";

const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36";

function isMissingSender(value: string) {
  const normalized = value.trim().toLocaleLowerCase("pt-BR");
  return !normalized || normalized === "informação indisponível";
}

function createScraperError(
  code: ScraperError["code"],
  message: string,
  cause?: unknown,
): ScraperError {
  const error = new Error(message, cause ? { cause } : undefined) as ScraperError;
  error.code = code;
  return error;
}

async function fetchSsw(
  url: string,
  options: RequestInit = {},
  attempt = 0,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": USER_AGENT,
        Referer: SSW_TRACKING_URL,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw createScraperError(
        "SSW_UNAVAILABLE",
        `O SSW respondeu com status HTTP ${response.status}.`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const html = new TextDecoder("iso-8859-1").decode(arrayBuffer);
    return html;
  } catch (error) {
    clearTimeout(timeoutId);

    if (
      error instanceof Error &&
      (error.name === "AbortError" || error.name === "TimeoutError")
    ) {
      if (attempt === 0) {
        return fetchSsw(url, options, 1);
      }

      throw createScraperError(
        "SSW_UNAVAILABLE",
        "O SSW não respondeu dentro do tempo limite.",
        error,
      );
    }

    if (error instanceof Error && "code" in error) {
      throw error;
    }

    throw createScraperError(
      "SCRAPING_FAILED",
      "Falha ao consultar o SSW.",
      error,
    );
  }
}

function assertHtmlLooksUsable(html: string): void {
  const normalized = html.toLowerCase();
  const knownFailures = [
    "erro interno",
    "sistema indispon",
    "temporariamente indispon",
    "acesso negado",
  ];

  if (knownFailures.some((failure) => normalized.includes(failure))) {
    throw createScraperError(
      "SCRAPING_FAILED",
      "A resposta do SSW não contém dados de rastreamento válidos.",
    );
  }
}

async function loadTrackingForm(): Promise<SswFormFields> {
  const html = await fetchSsw(SSW_TRACKING_URL);
  const $ = cheerio.load(html);
  const form = $("form").first();

  if (!form.length) {
    throw createScraperError(
      "SCRAPING_FAILED",
      "Não foi possível localizar o formulário público de rastreamento.",
    );
  }

  const hiddenFields = form
    .find("input[type='hidden']")
    .toArray()
    .map((element) => {
      const name = $(element).attr("name") ?? "";
      const value = $(element).attr("value") ?? "";
      return [name, value] as const;
    })
    .filter(([name]) => Boolean(name))
    .reduce<Record<string, string>>((accumulator, [name, value]) => {
      accumulator[name] = value;
      return accumulator;
    }, {});

  const cpfFieldName =
    form.find("input[type='tel']").attr("name") ??
    form.find("input:not([type='hidden'])").attr("name");

  if (!cpfFieldName) {
    throw createScraperError(
      "SCRAPING_FAILED",
      "Não foi possível identificar o campo de CPF do formulário.",
    );
  }

  return {
    action: form.attr("action") ?? "/2/resultSSW_dest",
    method: ((form.attr("method") ?? "POST").toUpperCase() as "GET" | "POST"),
    cpfFieldName,
    hiddenFields,
  };
}

export async function scrapeTrackingByCpf(cpf: string): Promise<string> {
  const form = await loadTrackingForm();
  const body = new URLSearchParams({
    ...form.hiddenFields,
    [form.cpfFieldName]: cpf,
  }).toString();

  const url = `${SSW_BASE_URL}${form.action}`;
  const html = await fetchSsw(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: SSW_BASE_URL,
    },
    body,
  });

  assertHtmlLooksUsable(html);
  return html;
}

export async function scrapeTrackingDetail(detailPath: string): Promise<string> {
  const url = detailPath.startsWith("http")
    ? detailPath
    : `${SSW_BASE_URL}${detailPath}`;

  const html = await fetchSsw(url);

  assertHtmlLooksUsable(html);
  return html;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const packages = await getTrackingByCpf(user.cpf);
    return NextResponse.json(
      packages.map((item) => ({
        ...item,
        recipient: isMissingSender(item.recipient) ? user.name : item.recipient,
      })),
    );
  } catch (error) {
    const status =
      error instanceof Error && "code" in error && String(error.code) === "INVALID_CPF"
        ? 400
        : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno." },
      { status },
    );
  }
}

export async function GET_DETAIL(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingId = searchParams.get("trackingId") ?? "";

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const data = await getTrackingDetailById(user.cpf, trackingId);
    return NextResponse.json({
      ...data,
      data: {
        ...data.data,
        recipient: isMissingSender(data.data.recipient)
          ? user.name
          : data.data.recipient,
      },
    });
  } catch (error) {
    const status =
      error instanceof Error && "code" in error
        ? String(error.code) === "INVALID_CPF"
          ? 400
          : String(error.code) === "TRACKING_NOT_FOUND"
            ? 404
            : 500
        : 500;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno." },
      { status },
    );
  }
}

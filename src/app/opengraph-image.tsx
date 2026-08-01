import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { APP_NAME } from "@/utils/constants";

export const alt = `${APP_NAME} — Painel logístico`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoSvg = await readFile(
    new URL("../../public/images/sacflow.svg", import.meta.url),
    "utf8",
  );
  const logoUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(logoSvg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 42,
          }}
        >
          <img
            src={logoUrl}
            width={720}
            height={170}
            alt={APP_NAME}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              color: "#475569",
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
          >
            Painel logístico e rastreamento de encomendas
          </div>
        </div>
      </div>
    ),
    size,
  );
}

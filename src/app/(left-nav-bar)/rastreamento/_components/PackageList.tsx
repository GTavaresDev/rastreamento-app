"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { PackageSummary } from "@/types";
import { PackageCard } from "@/app/(left-nav-bar)/rastreamento/_components/PackageCard";
import { StatusBadge } from "@/app/(left-nav-bar)/rastreamento/_components/StatusBadge";
import {
  formatRelativeDate,
  getStatusLabel,
} from "@core/domain/common/utils/formatters/date.formatter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useTrackingSearch } from "@/components/layout/TrackingSearchContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PackageListProps = {
  items: PackageSummary[];
  scrapedAt?: string;
  cpf?: string;
};

type StatusFilter =
  | "all"
  | "pedido"
  | "a_caminho"
  | "entregue"
  | "devolvido";

const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "pedido", label: "Pedido" },
  { value: "a_caminho", label: "A caminho" },
  { value: "entregue", label: "Entregue" },
  { value: "devolvido", label: "Devolvido" },
];

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesStatusFilter(status: string, filter: StatusFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "pedido") {
    return status === "pendente";
  }

  if (filter === "a_caminho") {
    return status === "em_transito" || status === "em_transferencia";
  }

  return status === filter;
}

export function PackageList({ items, scrapedAt, cpf }: PackageListProps) {
  const router = useRouter();
  const { query } = useTrackingSearch();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  function getDetailUrl(id: string) {
    return cpf
      ? `/rastreamento/detalhes-da-encomenda/${id}?cpf=${encodeURIComponent(cpf)}`
      : `/rastreamento/detalhes-da-encomenda/${id}`;
  }

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(query);

    return items.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        normalizeSearchValue(
          [
            item.nfNumber,
            item.orderNumber,
            item.recipient,
            item.lastEvent.description,
            getStatusLabel(item.currentStatus),
          ].join(" "),
        ).includes(normalizedQuery);

      return (
        matchesQuery && matchesStatusFilter(item.currentStatus, statusFilter)
      );
    });
  }, [items, query, statusFilter]);

  const columns: ColumnDef<PackageSummary>[] = useMemo(
    () => [
      {
        accessorKey: "nfNumber",
        header: "Nota fiscal",
        cell: ({ row }) => (
          <span className="text-sm font-semibold text-slate-950">
            {row.original.nfNumber}
          </span>
        ),
      },
      {
        accessorKey: "orderNumber",
        header: "Pedido",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-slate-800">
            {row.original.orderNumber}
          </span>
        ),
      },
      {
        accessorKey: "currentStatus",
        header: "Situação",
        cell: ({ row }) => (
          <StatusBadge status={row.original.currentStatus} />
        ),
      },
      {
        accessorKey: "recipient",
        header: "Destinatário",
        cell: ({ row }) => (
          <span className="line-clamp-2 min-w-[180px] text-sm font-semibold text-slate-900">
            {row.original.recipient}
          </span>
        ),
      },
      {
        accessorKey: "lastEvent",
        header: "Última atualização",
        cell: ({ row }) => {
          const description = row.original.lastEvent.description;
          const relativeDate = formatRelativeDate(
            row.original.lastEvent.dateTime,
            scrapedAt,
          );

          return (
            <div className="w-[240px] min-w-0 space-y-1">
              <Tooltip>
                <TooltipTrigger className="w-full cursor-pointer text-left">
                  <span className="block truncate text-sm font-medium text-slate-800">
                    {description}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  {description}
                </TooltipContent>
              </Tooltip>
              <p className="text-xs font-medium text-slate-400">
                {relativeDate}
              </p>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-semibold text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            onClick={(event) => {
              event.stopPropagation();
              router.push(getDetailUrl(row.original.id));
            }}
          >
            Ver detalhes
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scrapedAt, cpf, router],
  );

  const table = useReactTable({
    data: filteredItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            <span className="hidden shrink-0 text-xs font-semibold text-slate-500 sm:inline">
              Situação
            </span>
            {statusFilters.map((filter) => {
              const active = statusFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`shrink-0 cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-slate-300 bg-slate-200 text-slate-900"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-700">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "encomenda" : "encomendas"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:gap-5 md:hidden">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <PackageCard
              key={item.id}
              item={item}
              scrapedAt={scrapedAt}
              cpf={cpf}
            />
          ))
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">
            Nenhuma encomenda corresponde aos filtros.
          </p>
        )}
      </div>

      <div className="hidden w-full overflow-x-auto bg-white md:block">
        <Table className="min-w-[980px]">
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-slate-200 hover:bg-slate-50"
              >
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`h-12 whitespace-nowrap text-left text-sm font-semibold text-slate-500 ${
                      index === 0
                        ? "pl-5 pr-4"
                        : index === headerGroup.headers.length - 1
                          ? "pl-4 pr-5"
                          : "px-4"
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
                  onClick={() => router.push(getDetailUrl(row.original.id))}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={`h-[72px] align-middle ${
                        index === 0
                          ? "pl-5 pr-4"
                          : index === row.getVisibleCells().length - 1
                            ? "pl-4 pr-5"
                            : "px-4"
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-slate-500"
                >
                  Nenhuma encomenda corresponde aos filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

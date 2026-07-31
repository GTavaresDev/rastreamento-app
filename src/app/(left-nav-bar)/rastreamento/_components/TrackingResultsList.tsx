"use client";

import { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { PackageSummary } from "@/types";
import { PackageCard } from "./PackageCard";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeDate } from "@core/domain/common/utils/formatters/date.formatter";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTrackingResults } from "../_hooks/useTrackingResults";
import { TrackingFilterBar } from "./TrackingFilterBar";
import { TrackingRow } from "./TrackingRow";

type PackageListProps = {
  items: PackageSummary[];
  scrapedAt?: string;
  cpf?: string;
};

export function PackageList({ items, scrapedAt, cpf }: PackageListProps) {
  const {
    statusFilter,
    setStatusFilter,
    statusFilters,
    filteredItems,
    router,
    getDetailUrl,
  } = useTrackingResults({ items, cpf });

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
            scrapedAt
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
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              title="Ver detalhes"
              onClick={(event) => {
                event.stopPropagation();
                router.push(getDetailUrl(row.original.id));
              }}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Ver detalhes</span>
            </Button>
          </div>
        ),
      },
    ],
    [scrapedAt, router, getDetailUrl]
  );

  const table = useReactTable({
    data: filteredItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="w-full bg-white">
      {/* Filter Bar Component */}
      <TrackingFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusFilters={statusFilters}
        totalItems={filteredItems.length}
      />

      {/* Mobile Card List */}
      <div className="grid gap-4 p-4 sm:gap-5 md:hidden">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <PackageCard
              key={item.id}
              item={item}
              scrapedAt={scrapedAt}
            />
          ))
        ) : (
          <p className="py-10 text-center text-sm text-slate-500">
            Nenhuma encomenda corresponde aos filtros.
          </p>
        )}
      </div>

      {/* Desktop Table View */}
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TrackingRow
                  key={row.id}
                  row={row}
                  onRowClick={(id) => router.push(getDetailUrl(id))}
                />
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

export { PackageList as TrackingResultsList };

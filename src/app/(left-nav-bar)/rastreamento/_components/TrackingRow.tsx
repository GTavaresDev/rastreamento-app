"use client";

import { flexRender, type Row } from "@tanstack/react-table";
import type { PackageSummary } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";

type TrackingRowProps = {
  row: Row<PackageSummary>;
  onRowClick: (id: string) => void;
};

export function TrackingRow({ row, onRowClick }: TrackingRowProps) {
  const visibleCells = row.getVisibleCells();

  return (
    <TableRow
      className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50"
      onClick={() => onRowClick(row.original.id)}
    >
      {visibleCells.map((cell, index) => (
        <TableCell
          key={cell.id}
          className={`h-[72px] align-middle ${
            index === 0
              ? "pl-5 pr-4"
              : index === visibleCells.length - 1
                ? "pl-4 pr-5"
                : "px-4"
          }`}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

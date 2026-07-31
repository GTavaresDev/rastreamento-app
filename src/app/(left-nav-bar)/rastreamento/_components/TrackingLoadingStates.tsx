import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PackageListLoading() {
  return (
    <div className="w-full bg-white">
      {/* Filter Bar Skeleton */}
      <div className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Skeleton className="h-4 w-14 shrink-0" />
            <Skeleton className="h-8 w-16 shrink-0 rounded-lg" />
            <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
            <Skeleton className="h-8 w-24 shrink-0 rounded-lg" />
            <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
          </div>
          <Skeleton className="h-5 w-28 shrink-0 rounded-md" />
        </div>
      </div>

      {/* Mobile Card List Skeleton */}
      <div className="grid gap-4 p-4 sm:gap-5 md:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-52" />
            <div className="border-t border-slate-100 pt-3">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden w-full overflow-x-auto bg-white md:block">
        <Table className="min-w-[980px]">
          <TableHeader className="bg-slate-50">
            <TableRow className="border-b border-slate-200 hover:bg-slate-50">
              <TableHead className="h-10 pl-5 pr-4">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="h-10 px-4">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="h-10 px-4">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="h-10 px-4">
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead className="h-10 px-4">
                <Skeleton className="h-4 w-36" />
              </TableHead>
              <TableHead className="h-10 pl-4 pr-5">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="h-16 border-b border-slate-100">
                <TableCell className="pl-5 pr-4">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="px-4">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </TableCell>
                <TableCell className="pl-4 pr-5 text-right">
                  <Skeleton className="ml-auto h-8 w-8 rounded-lg" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function PackageDetailLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-lg">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-7 w-56" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
          <div className="grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
            ))}
          </div>
          <Skeleton className="mt-6 h-32 w-full rounded-xl" />
        </div>
      </div>
    </section>
  );
}

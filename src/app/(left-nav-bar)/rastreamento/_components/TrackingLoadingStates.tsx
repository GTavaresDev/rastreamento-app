import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PackageListLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:mb-8 sm:px-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="grid gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PackageDetailLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-xl">
        <Card className="gap-0 p-0">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-7 w-56" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
            <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
              ))}
            </div>
            <Skeleton className="mt-8 h-28 w-full rounded-xl" />
          </div>
          <div className="border-t border-slate-200 px-6 py-5 sm:px-8">
            <Skeleton className="h-5 w-28" />
          </div>
        </Card>
      </div>
    </section>
  );
}

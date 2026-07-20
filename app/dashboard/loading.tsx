import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-10 w-2/3 max-w-md" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <div className="glass-panel p-6 sm:p-8 lg:col-span-2">
          <div className="flex items-start gap-5">
            <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="mt-8 grid gap-6 border-t border-ivory-200/10 pt-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        <div className="glass-panel space-y-3 p-6 sm:p-8">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    </div>
  );
}

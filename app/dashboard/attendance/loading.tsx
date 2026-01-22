import { Skeleton } from "@/components/ui/skeleton"

export default function AttendanceLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48 bg-amber-200" />
        <Skeleton className="h-5 w-96 mt-2 bg-amber-100" />
      </div>
      <Skeleton className="h-96 w-full bg-amber-100" />
    </div>
  )
}

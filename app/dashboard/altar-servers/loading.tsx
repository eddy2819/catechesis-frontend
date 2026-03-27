export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-amber-200 rounded w-48" />
          <div className="h-4 bg-amber-100 rounded w-72 mt-2" />
        </div>
        <div className="h-10 bg-amber-200 rounded w-40" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-amber-100 rounded-lg" />
        ))}
      </div>
      <div className="h-96 bg-amber-50 rounded-lg" />
    </div>
  )
}

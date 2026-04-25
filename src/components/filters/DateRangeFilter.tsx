import { useFilters } from '@/filters/useFilters'

export function DateRangeFilter() {
  const { filters, setFilter } = useFilters()

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
      <label className="flex items-center gap-1.5">
        <span className="font-medium">Tarih</span>
        <input
          type="date"
          value={filters.date ?? ''}
          onChange={(e) => setFilter('date', e.target.value || undefined)}
          className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          aria-label="Gün"
        />
      </label>

      <span className="w-px h-5 bg-gray-200 mx-1" aria-hidden />

      <div className="flex items-center gap-1.5">
        <span className="font-medium">Saat</span>
        <input
          type="time"
          value={filters.timeFrom ?? ''}
          onChange={(e) => setFilter('timeFrom', e.target.value || undefined)}
          className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-700 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          aria-label="Saat başlangıç"
        />
        <span className="text-gray-400">→</span>
        <input
          type="time"
          value={filters.timeTo ?? ''}
          onChange={(e) => setFilter('timeTo', e.target.value || undefined)}
          className="bg-white border border-gray-200 rounded-md px-2.5 py-1.5 text-sm text-gray-700 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
          aria-label="Saat bitiş"
        />
      </div>
    </div>
  )
}

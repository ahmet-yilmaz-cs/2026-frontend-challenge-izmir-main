import { useFilters } from '@/filters/useFilters'
import { useLocationOptions } from '@/hooks/useLocationOptions'

export function LocationFilter({ label = 'Lokasyon' }: { label?: string }) {
  const { filters, setFilter } = useFilters()
  const locations = useLocationOptions()

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <span className="font-medium">{label}</span>
      <select
        value={filters.location ?? ''}
        onChange={(e) => setFilter('location', e.target.value || undefined)}
        className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
      >
        <option value="">Tümü</option>
        {locations.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

import { useFilters } from '@/filters/useFilters'
import { usePersonOptions } from '@/hooks/usePersonOptions'

export function PersonFilter({ label = 'Kişi' }: { label?: string }) {
  const { filters, setFilter } = useFilters()
  const persons = usePersonOptions()

  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <span className="font-medium">{label}</span>
      <select
        value={filters.person ?? ''}
        onChange={(e) => setFilter('person', e.target.value || undefined)}
        className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
      >
        <option value="">Tümü</option>
        {persons.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </label>
  )
}

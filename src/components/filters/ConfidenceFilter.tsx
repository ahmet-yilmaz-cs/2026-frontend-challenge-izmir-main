import { useFilters } from '@/filters/useFilters'

const LEVELS = [
  { value: 'high', label: 'Yüksek', color: 'green' },
  { value: 'medium', label: 'Orta', color: 'yellow' },
  { value: 'low', label: 'Düşük', color: 'red' },
] as const

const ACTIVE_CLASSES: Record<(typeof LEVELS)[number]['color'], string> = {
  green: 'bg-green-50 border-green-300 text-green-700',
  yellow: 'bg-yellow-50 border-yellow-300 text-yellow-700',
  red: 'bg-red-50 border-red-300 text-red-700',
}

export function ConfidenceFilter() {
  const { filters, setFilter } = useFilters()

  const selected = new Set(
    (filters.confidence ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  )

  const toggle = (value: string) => {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    const csv = [...next].join(',')
    setFilter('confidence', csv || undefined)
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-gray-600">Güven</span>
      <div className="flex items-center gap-1.5">
        {LEVELS.map((lvl) => {
          const active = selected.has(lvl.value)
          return (
            <button
              key={lvl.value}
              type="button"
              onClick={() => toggle(lvl.value)}
              className={`text-xs font-medium border rounded-full px-2.5 py-1 transition-colors ${
                active
                  ? ACTIVE_CLASSES[lvl.color]
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {lvl.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

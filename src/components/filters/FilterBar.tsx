import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useFilters, type FilterKey } from '@/filters/useFilters'

const ACTIVE_LABELS: Record<FilterKey, string> = {
  person: 'Kişi',
  location: 'Lokasyon',
  date: 'Tarih',
  timeFrom: 'Saatten',
  timeTo: 'Saate',
  q: 'Arama',
  confidence: 'Güven',
}

export function FilterBar({ children }: { children: ReactNode }) {
  const { filters, setFilter, reset, hasActiveFilters } = useFilters()

  const activeChips = (Object.keys(filters) as FilterKey[]).filter(
    (k) => filters[k],
  )

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto px-12 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {children}
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="ml-auto text-xs font-medium text-gray-500 hover:text-gray-800 px-2 py-1"
            >
              Filtreleri sıfırla
            </button>
          )}
        </div>

        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-2">
            {activeChips.map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full"
              >
                <span className="text-indigo-500">{ACTIVE_LABELS[key]}:</span>
                <span>{filters[key]}</span>
                <button
                  onClick={() => setFilter(key, undefined)}
                  className="text-indigo-400 hover:text-indigo-700"
                  aria-label={`${ACTIVE_LABELS[key]} filtresini kaldır`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

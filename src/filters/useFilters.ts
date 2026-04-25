import { useSearchParams } from 'react-router-dom'

export type Filters = {
  person?: string
  location?: string
  date?: string
  timeFrom?: string
  timeTo?: string
  q?: string
  confidence?: string
}

export type FilterKey = keyof Filters

export function useFilters() {
  const [params, setParams] = useSearchParams()

  const filters: Filters = {
    person: params.get('person') ?? undefined,
    location: params.get('location') ?? undefined,
    date: params.get('date') ?? undefined,
    timeFrom: params.get('timeFrom') ?? undefined,
    timeTo: params.get('timeTo') ?? undefined,
    q: params.get('q') ?? undefined,
    confidence: params.get('confidence') ?? undefined,
  }

  const setFilter = (key: FilterKey, value: string | undefined) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (!value) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
        return next
      },
      { replace: true },
    )
  }

  const reset = () => setParams({}, { replace: true })

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== '',
  )

  return { filters, setFilter, reset, hasActiveFilters }
}

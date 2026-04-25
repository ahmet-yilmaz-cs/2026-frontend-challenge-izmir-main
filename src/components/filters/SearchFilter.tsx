import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useFilters } from '@/filters/useFilters'

const DEBOUNCE_MS = 250

export function SearchFilter({
  placeholder = 'Notlarda, isimlerde, mesajlarda ara...',
}: {
  placeholder?: string
}) {
  const { filters, setFilter } = useFilters()
  const [draft, setDraft] = useState(filters.q ?? '')

  useEffect(() => {
    setDraft(filters.q ?? '')
  }, [filters.q])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = draft.trim() || undefined
      if (next !== filters.q) setFilter('q', next)
    }, DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  return (
    <div className="relative flex-1 min-w-[16rem] max-w-md">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-md pl-9 pr-3 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
      />
    </div>
  )
}

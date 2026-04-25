import { useFilters } from '@/filters/useFilters'

export function EmptyRow({ colSpan }: { colSpan: number }) {
  const { hasActiveFilters, reset } = useFilters()

  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        <p className="text-gray-500 text-sm mb-2">
          {hasActiveFilters
            ? 'Bu filtrelerle eşleşen kayıt bulunamadı.'
            : 'Henüz kayıt yok.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Filtreleri sıfırla
          </button>
        )}
      </td>
    </tr>
  )
}

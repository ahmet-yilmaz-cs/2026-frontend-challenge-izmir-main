import { useAnonymousTips } from '@/hooks/useAnonymousTips'
import { FormSection, Th, Td } from '@/components/FormSection'
import { PageContent } from '@/components/PageContent'
import { EmptyRow } from '@/components/EmptyRow'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { LocationFilter } from '@/components/filters/LocationFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { SearchFilter } from '@/components/filters/SearchFilter'
import { ConfidenceFilter } from '@/components/filters/ConfidenceFilter'
import { useFilters } from '@/filters/useFilters'
import { applyAnonymousTipFilters } from '@/filters/applyFilters'
import { formatDate, formatTime } from '@/utils/parseTimestamp'
import { CoordinateLink } from '@/components/cells/CoordinateLink'

const confidenceColor = {
  high: 'bg-red-50 text-red-700 border border-red-200',
  medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  low: 'bg-gray-100 text-gray-600 border border-gray-200',
} as const

export default function AnonymousTipsPage() {
  const { data, isLoading, isError } = useAnonymousTips()
  const { filters } = useFilters()

  const rows = data ? applyAnonymousTipFilters(data, filters) : undefined

  return (
    <>
      <FilterBar>
        <PersonFilter label="Şüpheli" />
        <LocationFilter />
        <ConfidenceFilter />
        <DateRangeFilter />
        <SearchFilter />
      </FilterBar>

      <PageContent>
        <FormSection
          state={{
            isLoading,
            isError,
            count: rows?.length,
            total: data?.length,
          }}
        >
          <thead>
            <tr>
              <Th>Suspect Name</Th>
              <Th>Location</Th>
              <Th>Coordinates</Th>
              <Th>Tarih</Th>
              <Th>Saat</Th>
              <Th>Tip</Th>
              <Th>Confidence</Th>
            </tr>
          </thead>
          <tbody>
            {rows?.length === 0 && <EmptyRow colSpan={7} />}
            {rows?.map((t) => (
              <tr key={t.id}>
                <Td>{t.suspectName}</Td>
                <Td>{t.location}</Td>
                <Td>
                  <CoordinateLink
                    coords={t.coordinates}
                    label={t.location}
                    subtitle={`${t.suspectName} · ${t.timestamp}`}
                  />
                </Td>
                <Td mono>{formatDate(t.timestamp)}</Td>
                <Td mono>{formatTime(t.timestamp)}</Td>
                <Td>{t.tip}</Td>
                <Td>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${confidenceColor[t.confidence]}`}
                  >
                    {t.confidence}
                  </span>
                </Td>
              </tr>
            ))}
          </tbody>
        </FormSection>
      </PageContent>
    </>
  )
}

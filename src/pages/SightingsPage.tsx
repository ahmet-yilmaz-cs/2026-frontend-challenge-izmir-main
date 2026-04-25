import { useSightings } from '@/hooks/useSightings'
import { FormSection, Th, Td } from '@/components/FormSection'
import { PageContent } from '@/components/PageContent'
import { EmptyRow } from '@/components/EmptyRow'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { LocationFilter } from '@/components/filters/LocationFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { SearchFilter } from '@/components/filters/SearchFilter'
import { useFilters } from '@/filters/useFilters'
import { applySightingFilters } from '@/filters/applyFilters'
import { formatDate, formatTime } from '@/utils/parseTimestamp'
import { CoordinateLink } from '@/components/cells/CoordinateLink'

export default function SightingsPage() {
  const { data, isLoading, isError } = useSightings()
  const { filters } = useFilters()

  const rows = data ? applySightingFilters(data, filters) : undefined

  return (
    <>
      <FilterBar>
        <PersonFilter />
        <LocationFilter />
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
              <Th>Person Name</Th>
              <Th>Seen With</Th>
              <Th>Location</Th>
              <Th>Coordinates</Th>
              <Th>Tarih</Th>
              <Th>Saat</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {rows?.length === 0 && <EmptyRow colSpan={7} />}
            {rows?.map((s) => (
              <tr key={s.id}>
                <Td>{s.personName}</Td>
                <Td>{s.seenWith}</Td>
                <Td>{s.location}</Td>
                <Td>
                  <CoordinateLink
                    coords={s.coordinates}
                    label={s.location}
                    subtitle={`${s.personName} · ${s.timestamp}`}
                  />
                </Td>
                <Td mono>{formatDate(s.timestamp)}</Td>
                <Td mono>{formatTime(s.timestamp)}</Td>
                <Td>{s.note}</Td>
              </tr>
            ))}
          </tbody>
        </FormSection>
      </PageContent>
    </>
  )
}

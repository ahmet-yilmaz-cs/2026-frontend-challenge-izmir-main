import { useCheckins } from '@/hooks/useCheckins'
import { FormSection, Th, Td } from '@/components/FormSection'
import { PageContent } from '@/components/PageContent'
import { EmptyRow } from '@/components/EmptyRow'
import { CoordinateLink } from '@/components/cells/CoordinateLink'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { LocationFilter } from '@/components/filters/LocationFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { SearchFilter } from '@/components/filters/SearchFilter'
import { useFilters } from '@/filters/useFilters'
import { applyCheckinFilters } from '@/filters/applyFilters'
import { formatDateTime } from '@/utils/parseTimestamp'

export default function CheckinsPage() {
  const { data, isLoading, isError } = useCheckins()
  const { filters } = useFilters()

  const rows = data ? applyCheckinFilters(data, filters) : undefined

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
              <Th>Full Name</Th>
              <Th>Location</Th>
              <Th>Coordinates</Th>
              <Th>Timestamp</Th>
              <Th>Note</Th>
            </tr>
          </thead>
          <tbody>
            {rows?.length === 0 && <EmptyRow colSpan={5} />}
            {rows?.map((c) => (
              <tr key={c.id}>
                <Td>{c.fullName}</Td>
                <Td>{c.location}</Td>
                <Td>
                  <CoordinateLink
                    coords={c.coordinates}
                    label={c.location}
                    subtitle={`${c.fullName} · ${c.timestamp}`}
                  />
                </Td>
                <Td mono>{formatDateTime(c.timestamp)}</Td>
                <Td>{c.note}</Td>
              </tr>
            ))}
          </tbody>
        </FormSection>
      </PageContent>
    </>
  )
}

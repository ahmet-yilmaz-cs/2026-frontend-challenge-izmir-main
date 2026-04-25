import { useMessages } from '@/hooks/useMessages'
import { FormSection, Th, Td } from '@/components/FormSection'
import { PageContent } from '@/components/PageContent'
import { EmptyRow } from '@/components/EmptyRow'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { SearchFilter } from '@/components/filters/SearchFilter'
import { useFilters } from '@/filters/useFilters'
import { applyMessageFilters } from '@/filters/applyFilters'
import { formatDate, formatTime } from '@/utils/parseTimestamp'

export default function MessagesPage() {
  const { data, isLoading, isError } = useMessages()
  const { filters } = useFilters()

  const rows = data ? applyMessageFilters(data, filters) : undefined

  return (
    <>
      <FilterBar>
        <PersonFilter />
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
              <Th>From</Th>
              <Th>To</Th>
              <Th>Message</Th>
              <Th>Tarih</Th>
              <Th>Saat</Th>
            </tr>
          </thead>
          <tbody>
            {rows?.length === 0 && <EmptyRow colSpan={5} />}
            {rows?.map((m) => (
              <tr key={m.id}>
                <Td>{m.from}</Td>
                <Td>{m.to}</Td>
                <Td>{m.message}</Td>
                <Td mono>{formatDate(m.timestamp)}</Td>
                <Td mono>{formatTime(m.timestamp)}</Td>
              </tr>
            ))}
          </tbody>
        </FormSection>
      </PageContent>
    </>
  )
}

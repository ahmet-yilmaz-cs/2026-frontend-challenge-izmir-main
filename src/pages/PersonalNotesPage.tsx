import { usePersonalNotes } from '@/hooks/usePersonalNotes'
import { FormSection, Th, Td } from '@/components/FormSection'
import { PageContent } from '@/components/PageContent'
import { EmptyRow } from '@/components/EmptyRow'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { SearchFilter } from '@/components/filters/SearchFilter'
import { useFilters } from '@/filters/useFilters'
import { applyPersonalNoteFilters } from '@/filters/applyFilters'
import { formatDate, formatTime } from '@/utils/parseTimestamp'

export default function PersonalNotesPage() {
  const { data, isLoading, isError } = usePersonalNotes()
  const { filters } = useFilters()

  const rows = data ? applyPersonalNoteFilters(data, filters) : undefined

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
              <Th>İsim</Th>
              <Th>Not</Th>
              <Th>Tarih</Th>
              <Th>Saat</Th>
            </tr>
          </thead>
          <tbody>
            {rows?.length === 0 && <EmptyRow colSpan={4} />}
            {rows?.map((n) => (
              <tr key={n.id}>
                <Td>{n.fullName}</Td>
                <Td>{n.note}</Td>
                <Td mono>{formatDate(n.timestamp)}</Td>
                <Td mono>{formatTime(n.timestamp)}</Td>
              </tr>
            ))}
          </tbody>
        </FormSection>
      </PageContent>
    </>
  )
}

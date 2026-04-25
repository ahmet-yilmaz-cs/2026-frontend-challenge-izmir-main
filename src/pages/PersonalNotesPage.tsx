import { usePersonalNotes } from '@/hooks/usePersonalNotes'
import { FormSection, Th, Td } from '@/components/FormSection'

export default function PersonalNotesPage() {
  const { data, isLoading, isError } = usePersonalNotes()

  return (
    <FormSection state={{ isLoading, isError, count: data?.length }}>
      <thead>
        <tr>
          <Th>Full Name</Th>
          <Th>Note</Th>
          <Th>Timestamp</Th>
        </tr>
      </thead>
      <tbody>
        {data?.map((n) => (
          <tr key={n.id}>
            <Td>{n.fullName}</Td>
            <Td>{n.note}</Td>
            <Td mono>{n.timestamp}</Td>
          </tr>
        ))}
      </tbody>
    </FormSection>
  )
}

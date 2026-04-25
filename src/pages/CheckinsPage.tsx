import { useCheckins } from '@/hooks/useCheckins'
import { FormSection, Th, Td } from '@/components/FormSection'

export default function CheckinsPage() {
  const { data, isLoading, isError } = useCheckins()

  return (
    <FormSection state={{ isLoading, isError, count: data?.length }}>
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
        {data?.map((c) => (
          <tr key={c.id}>
            <Td>{c.fullName}</Td>
            <Td>{c.location}</Td>
            <Td mono>{c.coordinates}</Td>
            <Td mono>{c.timestamp}</Td>
            <Td>{c.note}</Td>
          </tr>
        ))}
      </tbody>
    </FormSection>
  )
}

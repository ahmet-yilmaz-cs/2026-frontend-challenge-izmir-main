import { useSightings } from '@/hooks/useSightings'
import { FormSection, Th, Td } from '@/components/FormSection'

export default function SightingsPage() {
  const { data, isLoading, isError } = useSightings()

  return (
    <FormSection state={{ isLoading, isError, count: data?.length }}>
      <thead>
        <tr>
          <Th>Person Name</Th>
          <Th>Seen With</Th>
          <Th>Location</Th>
          <Th>Coordinates</Th>
          <Th>Timestamp</Th>
          <Th>Note</Th>
        </tr>
      </thead>
      <tbody>
        {data?.map((s) => (
          <tr key={s.id}>
            <Td>{s.personName}</Td>
            <Td>{s.seenWith}</Td>
            <Td>{s.location}</Td>
            <Td mono>{s.coordinates}</Td>
            <Td mono>{s.timestamp}</Td>
            <Td>{s.note}</Td>
          </tr>
        ))}
      </tbody>
    </FormSection>
  )
}

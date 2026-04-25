import { useMessages } from '@/hooks/useMessages'
import { FormSection, Th, Td } from '@/components/FormSection'

export default function MessagesPage() {
  const { data, isLoading, isError } = useMessages()

  return (
    <FormSection state={{ isLoading, isError, count: data?.length }}>
      <thead>
        <tr>
          <Th>From</Th>
          <Th>To</Th>
          <Th>Message</Th>
          <Th>Timestamp</Th>
        </tr>
      </thead>
      <tbody>
        {data?.map((m) => (
          <tr key={m.id}>
            <Td>{m.from}</Td>
            <Td>{m.to}</Td>
            <Td>{m.message}</Td>
            <Td mono>{m.timestamp}</Td>
          </tr>
        ))}
      </tbody>
    </FormSection>
  )
}

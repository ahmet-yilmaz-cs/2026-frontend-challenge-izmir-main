import { useAnonymousTips } from '@/hooks/useAnonymousTips'
import { FormSection, Th, Td } from '@/components/FormSection'

const confidenceColor = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-slate-700 text-slate-400',
} as const

export default function AnonymousTipsPage() {
  const { data, isLoading, isError } = useAnonymousTips()

  return (
    <FormSection state={{ isLoading, isError, count: data?.length }}>
      <thead>
        <tr>
          <Th>Suspect Name</Th>
          <Th>Location</Th>
          <Th>Coordinates</Th>
          <Th>Timestamp</Th>
          <Th>Tip</Th>
          <Th>Confidence</Th>
        </tr>
      </thead>
      <tbody>
        {data?.map((t) => (
          <tr key={t.id}>
            <Td>{t.suspectName}</Td>
            <Td>{t.location}</Td>
            <Td mono>{t.coordinates}</Td>
            <Td mono>{t.timestamp}</Td>
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
  )
}

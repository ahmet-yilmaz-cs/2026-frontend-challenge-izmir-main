import { useQuery } from '@tanstack/react-query'
import { fetchMessages } from '@/api/jotformApi'
import { isJunkName } from '@/utils/normalizeName'

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    select: (data) =>
      data.filter((m) => !isJunkName(m.from) && !isJunkName(m.to)),
  })
}

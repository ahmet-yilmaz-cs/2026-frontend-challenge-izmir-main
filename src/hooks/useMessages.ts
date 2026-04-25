import { useQuery } from '@tanstack/react-query'
import { fetchMessages } from '@/api/jotformApi'

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
  })
}

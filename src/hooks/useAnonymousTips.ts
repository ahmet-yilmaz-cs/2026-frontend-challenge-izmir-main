import { useQuery } from '@tanstack/react-query'
import { fetchAnonymousTips } from '@/api/jotformApi'

export function useAnonymousTips() {
  return useQuery({
    queryKey: ['anonymousTips'],
    queryFn: fetchAnonymousTips,
  })
}

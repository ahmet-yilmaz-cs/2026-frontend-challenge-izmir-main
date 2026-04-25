import { useQuery } from '@tanstack/react-query'
import { fetchAnonymousTips } from '@/api/jotformApi'
import { isJunkName } from '@/utils/normalizeName'

export function useAnonymousTips() {
  return useQuery({
    queryKey: ['anonymousTips'],
    queryFn: fetchAnonymousTips,
    select: (data) => data.filter((t) => !isJunkName(t.suspectName)),
  })
}

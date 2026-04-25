import { useQuery } from '@tanstack/react-query'
import { fetchCheckins } from '@/api/jotformApi'
import { isJunkName } from '@/utils/normalizeName'

export function useCheckins() {
  return useQuery({
    queryKey: ['checkins'],
    queryFn: fetchCheckins,
    select: (data) => data.filter((c) => !isJunkName(c.fullName)),
  })
}

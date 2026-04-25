import { useQuery } from '@tanstack/react-query'
import { fetchCheckins } from '@/api/jotformApi'

export function useCheckins() {
  return useQuery({
    queryKey: ['checkins'],
    queryFn: fetchCheckins,
  })
}

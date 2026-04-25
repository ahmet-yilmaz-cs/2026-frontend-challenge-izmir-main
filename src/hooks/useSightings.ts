import { useQuery } from '@tanstack/react-query'
import { fetchSightings } from '@/api/jotformApi'
import { isJunkName } from '@/utils/normalizeName'

export function useSightings() {
  return useQuery({
    queryKey: ['sightings'],
    queryFn: fetchSightings,
    select: (data) => data.filter((s) => !isJunkName(s.personName)),
  })
}

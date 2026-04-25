import { useQuery } from '@tanstack/react-query'
import { fetchSightings } from '@/api/jotformApi'

export function useSightings() {
  return useQuery({
    queryKey: ['sightings'],
    queryFn: fetchSightings,
  })
}

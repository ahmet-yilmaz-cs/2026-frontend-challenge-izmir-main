import { useQuery } from '@tanstack/react-query'
import { fetchPersonalNotes } from '@/api/jotformApi'
import { isJunkName } from '@/utils/normalizeName'

export function usePersonalNotes() {
  return useQuery({
    queryKey: ['personalNotes'],
    queryFn: fetchPersonalNotes,
    select: (data) => data.filter((n) => !isJunkName(n.fullName)),
  })
}

import { useQuery } from '@tanstack/react-query'
import { fetchPersonalNotes } from '@/api/jotformApi'

export function usePersonalNotes() {
  return useQuery({
    queryKey: ['personalNotes'],
    queryFn: fetchPersonalNotes,
  })
}

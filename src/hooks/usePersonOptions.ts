import { useCheckins } from './useCheckins'
import { useMessages } from './useMessages'
import { useSightings } from './useSightings'
import { usePersonalNotes } from './usePersonalNotes'
import { useAnonymousTips } from './useAnonymousTips'
import { getUniqueNames } from '@/utils/normalizeName'

export function usePersonOptions(): string[] {
  const { data: checkins } = useCheckins()
  const { data: messages } = useMessages()
  const { data: sightings } = useSightings()
  const { data: notes } = usePersonalNotes()
  const { data: tips } = useAnonymousTips()

  const all: string[] = []

  checkins?.forEach((c) => all.push(c.fullName))
  messages?.forEach((m) => {
    all.push(m.from)
    all.push(m.to)
  })
  sightings?.forEach((s) => {
    all.push(s.personName)
    if (s.seenWith) {
      s.seenWith.split(',').forEach((p) => all.push(p.trim()))
    }
  })
  notes?.forEach((n) => all.push(n.fullName))
  tips?.forEach((t) => all.push(t.suspectName))

  return getUniqueNames(all)
}

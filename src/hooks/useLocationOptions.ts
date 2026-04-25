import { useCheckins } from './useCheckins'
import { useSightings } from './useSightings'
import { useAnonymousTips } from './useAnonymousTips'

export function useLocationOptions(): string[] {
  const { data: checkins } = useCheckins()
  const { data: sightings } = useSightings()
  const { data: tips } = useAnonymousTips()

  const seen = new Map<string, string>()
  const push = (raw?: string) => {
    if (!raw) return
    const trimmed = raw.trim()
    if (!trimmed) return
    const key = trimmed.toLowerCase()
    if (!seen.has(key)) seen.set(key, trimmed)
  }

  checkins?.forEach((c) => push(c.location))
  sightings?.forEach((s) => push(s.location))
  tips?.forEach((t) => push(t.location))

  return [...seen.values()].sort((a, b) => a.localeCompare(b, 'tr'))
}

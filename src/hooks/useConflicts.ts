import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useSightings } from './useSightings'
import { useAnonymousTips } from './useAnonymousTips'
import { useFilters } from '@/filters/useFilters'
import { isSamePerson } from '@/utils/normalizeName'
import { parseCoordinates } from '@/utils/parseCoordinates'
import { matchesDateAndTime, parseTimestamp } from '@/utils/parseTimestamp'
import {
  detectConflicts,
  type Conflict,
  type ConflictEvent,
} from '@/utils/detectConflicts'

export function useConflicts(): {
  conflicts: Conflict[]
  events: ConflictEvent[]
  isLoading: boolean
  isError: boolean
} {
  const { data: checkins, isLoading: lc, isError: ec } = useCheckins()
  const { data: sightings, isLoading: ls, isError: es } = useSightings()
  const { data: tips, isLoading: lt, isError: et } = useAnonymousTips()
  const { filters } = useFilters()

  const events = useMemo<ConflictEvent[]>(() => {
    const out: ConflictEvent[] = []

    const matchesPersonOrEmpty = (name: string) =>
      !filters.person || isSamePerson(name, filters.person)
    const matchesTime = (ts: string) =>
      matchesDateAndTime(ts, filters.date, filters.timeFrom, filters.timeTo)

    checkins?.forEach((c) => {
      if (!matchesPersonOrEmpty(c.fullName)) return
      if (!matchesTime(c.timestamp)) return
      const coords = parseCoordinates(c.coordinates)
      if (!coords) return
      out.push({
        id: `checkin-${c.id}`,
        source: 'checkin',
        personName: c.fullName,
        location: c.location,
        coords,
        timestamp: c.timestamp,
        date: parseTimestamp(c.timestamp),
        detail: c.note || c.location,
      })
    })

    sightings?.forEach((s) => {
      if (!matchesPersonOrEmpty(s.personName)) return
      if (!matchesTime(s.timestamp)) return
      const coords = parseCoordinates(s.coordinates)
      if (!coords) return
      out.push({
        id: `sighting-${s.id}`,
        source: 'sighting',
        personName: s.personName,
        location: s.location,
        coords,
        timestamp: s.timestamp,
        date: parseTimestamp(s.timestamp),
        detail: s.note || s.location,
      })
    })

    tips?.forEach((t) => {
      if (!matchesPersonOrEmpty(t.suspectName)) return
      if (!matchesTime(t.timestamp)) return
      const coords = parseCoordinates(t.coordinates)
      if (!coords) return
      out.push({
        id: `tip-${t.id}`,
        source: 'tip',
        personName: t.suspectName,
        location: t.location,
        coords,
        timestamp: t.timestamp,
        date: parseTimestamp(t.timestamp),
        detail: t.tip,
        confidence: t.confidence,
      })
    })

    return out
  }, [checkins, sightings, tips, filters.person, filters.date, filters.timeFrom, filters.timeTo])

  const conflicts = useMemo(() => detectConflicts(events), [events])

  return {
    conflicts,
    events,
    isLoading: lc || ls || lt,
    isError: ec || es || et,
  }
}

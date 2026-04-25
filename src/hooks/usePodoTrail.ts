import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useSightings } from './useSightings'
import { useAnonymousTips } from './useAnonymousTips'
import { useMessages } from './useMessages'
import { usePersonalNotes } from './usePersonalNotes'
import { useFilters } from '@/filters/useFilters'
import { isSamePerson } from '@/utils/normalizeName'
import { parseCoordinates, type Coords } from '@/utils/parseCoordinates'
import { matchesDateAndTime, parseTimestamp } from '@/utils/parseTimestamp'

export type PodoEventSource =
  | 'checkin'
  | 'sighting'
  | 'sighting-companion'
  | 'tip'
  | 'message'
  | 'note'

export type PodoEvent = {
  id: string
  source: PodoEventSource
  timestamp: string
  date: Date
  location?: string
  coords: Coords | null
  title: string
  detail: string
  meta?: string
}

const PODO = 'Podo'

export function usePodoTrail(): {
  events: PodoEvent[]
  isLoading: boolean
  isError: boolean
  totalAll: number
} {
  const { data: checkins, isLoading: lc, isError: ec } = useCheckins()
  const { data: sightings, isLoading: ls, isError: es } = useSightings()
  const { data: tips, isLoading: lt, isError: et } = useAnonymousTips()
  const { data: messages, isLoading: lm, isError: em } = useMessages()
  const { data: notes, isLoading: ln, isError: en } = usePersonalNotes()
  const { filters } = useFilters()

  const events = useMemo<PodoEvent[]>(() => {
    const out: PodoEvent[] = []

    checkins
      ?.filter((c) => isSamePerson(c.fullName, PODO))
      .forEach((c) =>
        out.push({
          id: `checkin-${c.id}`,
          source: 'checkin',
          timestamp: c.timestamp,
          date: parseTimestamp(c.timestamp),
          location: c.location,
          coords: parseCoordinates(c.coordinates),
          title: 'Podo check-in yaptı',
          detail: c.note || c.location || '—',
        }),
      )

    sightings?.forEach((s) => {
      const isPodo = isSamePerson(s.personName, PODO)
      const seenWithPodo =
        !isPodo &&
        s.seenWith
          .split(',')
          .some((p) => isSamePerson(p.trim(), PODO))

      if (isPodo) {
        out.push({
          id: `sighting-${s.id}`,
          source: 'sighting',
          timestamp: s.timestamp,
          date: parseTimestamp(s.timestamp),
          location: s.location,
          coords: parseCoordinates(s.coordinates),
          title: 'Podo görüldü',
          detail:
            s.note ||
            (s.seenWith ? `Beraber: ${s.seenWith}` : s.location || '—'),
          meta: s.seenWith,
        })
      } else if (seenWithPodo) {
        out.push({
          id: `companion-${s.id}`,
          source: 'sighting-companion',
          timestamp: s.timestamp,
          date: parseTimestamp(s.timestamp),
          location: s.location,
          coords: parseCoordinates(s.coordinates),
          title: `${s.personName}, Podo ile birlikte`,
          detail: s.note || s.location || '—',
        })
      }
    })

    tips
      ?.filter((t) => isSamePerson(t.suspectName, PODO))
      .forEach((t) =>
        out.push({
          id: `tip-${t.id}`,
          source: 'tip',
          timestamp: t.timestamp,
          date: parseTimestamp(t.timestamp),
          location: t.location,
          coords: parseCoordinates(t.coordinates),
          title: 'Anonim ihbar (Podo)',
          detail: t.tip,
          meta: t.confidence,
        }),
      )

    messages
      ?.filter(
        (m) => isSamePerson(m.from, PODO) || isSamePerson(m.to, PODO),
      )
      .forEach((m) => {
        const isSender = isSamePerson(m.from, PODO)
        out.push({
          id: `msg-${m.id}`,
          source: 'message',
          timestamp: m.timestamp,
          date: parseTimestamp(m.timestamp),
          coords: null,
          title: isSender ? `Podo → ${m.to}` : `${m.from} → Podo`,
          detail: m.message,
        })
      })

    notes
      ?.filter((n) => isSamePerson(n.fullName, PODO))
      .forEach((n) =>
        out.push({
          id: `note-${n.id}`,
          source: 'note',
          timestamp: n.timestamp,
          date: parseTimestamp(n.timestamp),
          coords: null,
          title: "Podo'nun notu",
          detail: n.note,
        }),
      )

    return out.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [checkins, sightings, tips, messages, notes])

  const filtered = useMemo(
    () =>
      events.filter((e) =>
        matchesDateAndTime(
          e.timestamp,
          filters.date,
          filters.timeFrom,
          filters.timeTo,
        ),
      ),
    [events, filters.date, filters.timeFrom, filters.timeTo],
  )

  return {
    events: filtered,
    isLoading: lc || ls || lt || lm || ln,
    isError: ec || es || et || em || en,
    totalAll: events.length,
  }
}

import type { Checkin, Message, Sighting, PersonalNote, AnonymousTip } from '@/types'
import type { Filters } from './useFilters'
import { isSamePerson } from '@/utils/normalizeName'
import { isSameLocation } from '@/utils/normalizeLocation'
import { matchesDateAndTime } from '@/utils/parseTimestamp'
import { foldText } from '@/utils/foldText'

function seenWithIncludes(seenWith: string, target: string): boolean {
  if (!seenWith) return false
  return seenWith
    .split(',')
    .map((s) => s.trim())
    .some((name) => isSamePerson(name, target))
}

function matchesQuery(q: string | undefined, ...fields: string[]): boolean {
  if (!q) return true
  const needle = foldText(q.trim())
  if (!needle) return true
  return fields.some((f) => f && foldText(f).includes(needle))
}

function matchesLocation(rowLocation: string, target: string | undefined): boolean {
  if (!target) return true
  return isSameLocation(rowLocation, target)
}

function matchesConfidence(
  rowConfidence: string,
  target: string | undefined,
): boolean {
  if (!target) return true
  const allowed = target.split(',').map((s) => s.trim()).filter(Boolean)
  if (allowed.length === 0) return true
  return allowed.includes(rowConfidence)
}

export function applyCheckinFilters(rows: Checkin[], f: Filters): Checkin[] {
  return rows.filter((c) => {
    if (f.person && !isSamePerson(c.fullName, f.person)) return false
    if (!matchesLocation(c.location, f.location)) return false
    if (!matchesDateAndTime(c.timestamp, f.date, f.timeFrom, f.timeTo)) return false
    if (!matchesQuery(f.q, c.fullName, c.location, c.note)) return false
    return true
  })
}

export function applyMessageFilters(rows: Message[], f: Filters): Message[] {
  return rows.filter((m) => {
    if (f.person) {
      const matchesFrom = isSamePerson(m.from, f.person)
      const matchesTo = isSamePerson(m.to, f.person)
      if (!matchesFrom && !matchesTo) return false
    }
    if (!matchesDateAndTime(m.timestamp, f.date, f.timeFrom, f.timeTo)) return false
    if (!matchesQuery(f.q, m.from, m.to, m.message)) return false
    return true
  })
}

export function applySightingFilters(rows: Sighting[], f: Filters): Sighting[] {
  return rows.filter((s) => {
    if (f.person) {
      const matchesPerson = isSamePerson(s.personName, f.person)
      const matchesSeen = seenWithIncludes(s.seenWith, f.person)
      if (!matchesPerson && !matchesSeen) return false
    }
    if (!matchesLocation(s.location, f.location)) return false
    if (!matchesDateAndTime(s.timestamp, f.date, f.timeFrom, f.timeTo)) return false
    if (!matchesQuery(f.q, s.personName, s.seenWith, s.location, s.note)) return false
    return true
  })
}

export function applyPersonalNoteFilters(
  rows: PersonalNote[],
  f: Filters,
): PersonalNote[] {
  return rows.filter((n) => {
    if (f.person && !isSamePerson(n.fullName, f.person)) return false
    if (!matchesDateAndTime(n.timestamp, f.date, f.timeFrom, f.timeTo)) return false
    if (!matchesQuery(f.q, n.fullName, n.note)) return false
    return true
  })
}

export function applyAnonymousTipFilters(
  rows: AnonymousTip[],
  f: Filters,
): AnonymousTip[] {
  return rows.filter((t) => {
    if (f.person && !isSamePerson(t.suspectName, f.person)) return false
    if (!matchesLocation(t.location, f.location)) return false
    if (!matchesConfidence(t.confidence, f.confidence)) return false
    if (!matchesDateAndTime(t.timestamp, f.date, f.timeFrom, f.timeTo)) return false
    if (!matchesQuery(f.q, t.suspectName, t.location, t.tip)) return false
    return true
  })
}

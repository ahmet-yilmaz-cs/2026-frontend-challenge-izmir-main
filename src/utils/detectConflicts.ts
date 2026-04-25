import type { Coords } from './parseCoordinates'
import { haversineKm } from './haversine'

export type ConflictSource = 'checkin' | 'sighting' | 'tip'

export type ConflictEvent = {
  id: string
  source: ConflictSource
  personName: string
  location: string
  coords: Coords
  timestamp: string
  date: Date
  detail: string
  /** For tips, "low" confidence is naturally less reliable. */
  confidence?: 'low' | 'medium' | 'high'
}

export type ConflictSeverity = 'critical' | 'high' | 'medium'

export type Conflict = {
  id: string
  personName: string
  a: ConflictEvent
  b: ConflictEvent
  /** Distance between the two locations in km. */
  distanceKm: number
  /** Time delta in minutes (always positive, b - a). */
  minutesApart: number
  /** Effective speed required to traverse: km / hour. Infinity if minutesApart === 0. */
  speedKmh: number
  severity: ConflictSeverity
}

/** Effective speed (km/h) above which we consider movement implausible. */
const SPEED_THRESHOLD_KMH = 30

/** Same minute, different location: any distance above this counts as critical. */
const ZERO_TIME_DISTANCE_KM = 0.3

function classify(speedKmh: number, minutesApart: number, distanceKm: number): ConflictSeverity | null {
  if (minutesApart === 0) {
    if (distanceKm >= ZERO_TIME_DISTANCE_KM) return 'critical'
    return null
  }
  if (speedKmh > 100) return 'critical'
  if (speedKmh > 60) return 'high'
  if (speedKmh > SPEED_THRESHOLD_KMH) return 'medium'
  return null
}

/**
 * Detect adjacent-pair conflicts per person:
 * sort events by time, look at every consecutive pair, flag if effective
 * travel speed exceeds plausibility.
 */
export function detectConflicts(events: ConflictEvent[]): Conflict[] {
  const byPerson = new Map<string, ConflictEvent[]>()
  for (const e of events) {
    if (!e.personName) continue
    const list = byPerson.get(e.personName) ?? []
    list.push(e)
    byPerson.set(e.personName, list)
  }

  const conflicts: Conflict[] = []

  for (const [personName, list] of byPerson) {
    list.sort((a, b) => a.date.getTime() - b.date.getTime())
    for (let i = 1; i < list.length; i += 1) {
      const a = list[i - 1]
      const b = list[i]
      const distanceKm = haversineKm(a.coords, b.coords)
      if (distanceKm < ZERO_TIME_DISTANCE_KM) continue

      const ms = b.date.getTime() - a.date.getTime()
      const minutesApart = Math.max(0, Math.round(ms / 60000))
      const hours = ms / 3_600_000
      const speedKmh = hours > 0 ? distanceKm / hours : Number.POSITIVE_INFINITY

      const severity = classify(speedKmh, minutesApart, distanceKm)
      if (!severity) continue

      conflicts.push({
        id: `${a.id}__${b.id}`,
        personName,
        a,
        b,
        distanceKm,
        minutesApart,
        speedKmh,
        severity,
      })
    }
  }

  const severityRank: Record<ConflictSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
  }
  return conflicts.sort((x, y) => {
    const dr = severityRank[x.severity] - severityRank[y.severity]
    if (dr !== 0) return dr
    return y.speedKmh - x.speedKmh
  })
}

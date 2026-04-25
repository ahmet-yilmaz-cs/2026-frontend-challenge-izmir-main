import { useMemo } from 'react'
import { useCheckins } from './useCheckins'
import { useSightings } from './useSightings'
import { useAnonymousTips } from './useAnonymousTips'
import { useFilters } from '@/filters/useFilters'
import { applyCheckinFilters, applySightingFilters, applyAnonymousTipFilters } from '@/filters/applyFilters'
import { parseCoordinates, type Coords } from '@/utils/parseCoordinates'

export type CoordSource = 'checkin' | 'sighting' | 'tip'

export type CoordPoint = {
  id: string
  source: CoordSource
  lat: number
  lng: number
  personName: string
  location: string
  timestamp: string
  detail: string
  meta?: string
}

export function useAllCoordinates(): {
  points: CoordPoint[]
  isLoading: boolean
  isError: boolean
  totals: { all: number; checkin: number; sighting: number; tip: number }
  filtered: { checkin: number; sighting: number; tip: number }
} {
  const { data: checkins, isLoading: lc, isError: ec } = useCheckins()
  const { data: sightings, isLoading: ls, isError: es } = useSightings()
  const { data: tips, isLoading: lt, isError: et } = useAnonymousTips()
  const { filters } = useFilters()

  const filteredCheckins = useMemo(
    () => (checkins ? applyCheckinFilters(checkins, filters) : []),
    [checkins, filters],
  )
  const filteredSightings = useMemo(
    () => (sightings ? applySightingFilters(sightings, filters) : []),
    [sightings, filters],
  )
  const filteredTips = useMemo(
    () => (tips ? applyAnonymousTipFilters(tips, filters) : []),
    [tips, filters],
  )

  const points = useMemo<CoordPoint[]>(() => {
    const out: CoordPoint[] = []

    filteredCheckins.forEach((c) => {
      const coords = parseCoordinates(c.coordinates)
      if (coords) out.push(toPoint('checkin', `checkin-${c.id}`, coords, c.fullName, c.location, c.timestamp, c.note))
    })
    filteredSightings.forEach((s) => {
      const coords = parseCoordinates(s.coordinates)
      if (coords)
        out.push(
          toPoint(
            'sighting',
            `sighting-${s.id}`,
            coords,
            s.personName,
            s.location,
            s.timestamp,
            s.note,
            s.seenWith,
          ),
        )
    })
    filteredTips.forEach((t) => {
      const coords = parseCoordinates(t.coordinates)
      if (coords)
        out.push(
          toPoint(
            'tip',
            `tip-${t.id}`,
            coords,
            t.suspectName,
            t.location,
            t.timestamp,
            t.tip,
            t.confidence,
          ),
        )
    })

    return out
  }, [filteredCheckins, filteredSightings, filteredTips])

  return {
    points,
    isLoading: lc || ls || lt,
    isError: ec || es || et,
    totals: {
      all: (checkins?.length ?? 0) + (sightings?.length ?? 0) + (tips?.length ?? 0),
      checkin: checkins?.length ?? 0,
      sighting: sightings?.length ?? 0,
      tip: tips?.length ?? 0,
    },
    filtered: {
      checkin: filteredCheckins.length,
      sighting: filteredSightings.length,
      tip: filteredTips.length,
    },
  }
}

function toPoint(
  source: CoordSource,
  id: string,
  c: Coords,
  personName: string,
  location: string,
  timestamp: string,
  detail: string,
  meta?: string,
): CoordPoint {
  return {
    id,
    source,
    lat: c.lat,
    lng: c.lng,
    personName,
    location,
    timestamp,
    detail,
    meta,
  }
}

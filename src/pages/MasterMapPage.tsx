import { useMemo, useState } from 'react'
import { MapPin, Eye } from 'lucide-react'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { LocationFilter } from '@/components/filters/LocationFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { Loader } from '@/components/Loader'
import { MapView, type MapMarker } from '@/components/map/MapView'
import { useAllCoordinates, type CoordSource, type CoordPoint } from '@/hooks/useAllCoordinates'
import { formatDate, formatTime } from '@/utils/parseTimestamp'

type SourceMeta = {
  label: string
  hex: string
  badge: string
  dot: string
}

const SOURCE: Record<CoordSource, SourceMeta> = {
  checkin: {
    label: 'Check-in',
    hex: '#4f46e5',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dot: 'bg-indigo-500',
  },
  sighting: {
    label: 'Görülme',
    hex: '#16a34a',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  tip: {
    label: 'İhbar',
    hex: '#d97706',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
}

const ALL_SOURCES: CoordSource[] = ['checkin', 'sighting', 'tip']

export default function MasterMapPage() {
  const { points, isLoading, isError, filtered } = useAllCoordinates()
  const [enabled, setEnabled] = useState<Record<CoordSource, boolean>>({
    checkin: true,
    sighting: true,
    tip: true,
  })

  const visiblePoints = useMemo(
    () => points.filter((p) => enabled[p.source]),
    [points, enabled],
  )

  const markers = useMemo<MapMarker[]>(
    () =>
      visiblePoints.map((p) => ({
        id: p.id,
        lat: p.lat,
        lng: p.lng,
        color: SOURCE[p.source].hex,
        popup: <PopupBody point={p} />,
      })),
    [visiblePoints],
  )

  const counts: Record<CoordSource, number> = useMemo(() => {
    const acc: Record<CoordSource, number> = { checkin: 0, sighting: 0, tip: 0 }
    points.forEach((p) => {
      acc[p.source] += 1
    })
    return acc
  }, [points])

  return (
    <div className="h-full flex flex-col">
      <FilterBar>
        <PersonFilter />
        <LocationFilter />
        <DateRangeFilter />
        <div className="ml-auto flex items-center gap-1.5">
          {ALL_SOURCES.map((s) => {
            const meta = SOURCE[s]
            const isOn = enabled[s]
            return (
              <button
                key={s}
                type="button"
                onClick={() =>
                  setEnabled((prev) => ({ ...prev, [s]: !prev[s] }))
                }
                className={`text-xs font-medium px-2.5 py-1 rounded-md border transition-colors flex items-center gap-1.5 ${
                  isOn
                    ? meta.badge
                    : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOn ? meta.dot : 'bg-gray-300'}`} />
                {meta.label}
                <span className="tabular-nums opacity-70">{counts[s]}</span>
              </button>
            )
          })}
        </div>
      </FilterBar>

      <div className="relative flex-1 min-h-0 bg-gray-50">
        <MapView markers={markers} />
        {isLoading && <Loader />}
        {isError && (
          <div className="absolute top-4 left-4 bg-white border border-red-200 rounded-md px-3 py-2 text-sm text-red-600 shadow-sm">
            Veri çekilemedi.
          </div>
        )}
        {!isLoading && !isError && (
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-gray-200 rounded-md px-4 py-3 shadow-sm text-xs text-gray-600 flex flex-col gap-1.5 min-w-[200px]">
            <div className="font-semibold text-gray-700 mb-0.5">
              Filtreli kayıt
            </div>
            {ALL_SOURCES.map((s) => {
              const meta = SOURCE[s]
              return (
                <div key={s} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${meta.dot}`} />
                  <span className="flex-1">{meta.label}</span>
                  <span className="tabular-nums text-gray-500">
                    {filtered[s]}
                  </span>
                </div>
              )
            })}
            <div className="border-t border-gray-100 pt-1.5 mt-0.5 flex items-center gap-2">
              <span className="flex-1 font-semibold text-gray-700">
                Haritada
              </span>
              <span className="tabular-nums text-gray-700 font-semibold">
                {visiblePoints.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PopupBody({ point }: { point: CoordPoint }) {
  const meta = SOURCE[point.source]
  return (
    <div className="text-xs min-w-[200px]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 border rounded ${meta.badge}`}
        >
          {meta.label}
        </span>
        {point.source === 'tip' && point.meta && (
          <span className="text-[10px] uppercase tracking-wide text-gray-500">
            {point.meta}
          </span>
        )}
      </div>
      <div className="font-semibold text-gray-800">{point.personName}</div>
      <div className="text-gray-600 mt-0.5 line-clamp-3">{point.detail}</div>
      <div className="text-gray-500 mt-1 flex items-center gap-1">
        <MapPin size={11} className="text-gray-400" />
        {point.location}
      </div>
      {point.source === 'sighting' && point.meta && (
        <div className="text-gray-500 mt-0.5 flex items-center gap-1">
          <Eye size={11} className="text-gray-400" />
          Beraber: {point.meta}
        </div>
      )}
      <div className="text-gray-400 mt-1 tabular-nums">
        {formatDate(point.timestamp)} · {formatTime(point.timestamp)}
      </div>
    </div>
  )
}

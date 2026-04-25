import { useMemo, useState } from 'react'
import {
  MapPin,
  Eye,
  Users,
  AlertTriangle,
  MessageSquare,
  StickyNote,
  type LucideIcon,
} from 'lucide-react'
import { FilterBar } from '@/components/filters/FilterBar'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { Loader } from '@/components/Loader'
import { MapView, type MapMarker } from '@/components/map/MapView'
import { usePodoTrail, type PodoEvent, type PodoEventSource } from '@/hooks/usePodoTrail'
import { formatDate, formatTime } from '@/utils/parseTimestamp'

type SourceMeta = {
  label: string
  icon: LucideIcon
  color: string
  badge: string
  hex: string
}

const SOURCE: Record<PodoEventSource, SourceMeta> = {
  checkin: {
    label: 'Check-in',
    icon: MapPin,
    color: 'indigo',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    hex: '#4f46e5',
  },
  sighting: {
    label: 'Görülme',
    icon: Eye,
    color: 'green',
    badge: 'bg-green-50 text-green-700 border-green-200',
    hex: '#16a34a',
  },
  'sighting-companion': {
    label: 'Beraber görüldü',
    icon: Users,
    color: 'teal',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    hex: '#0d9488',
  },
  tip: {
    label: 'İhbar',
    icon: AlertTriangle,
    color: 'amber',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    hex: '#d97706',
  },
  message: {
    label: 'Mesaj',
    icon: MessageSquare,
    color: 'gray',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    hex: '#6b7280',
  },
  note: {
    label: 'Not',
    icon: StickyNote,
    color: 'gray',
    badge: 'bg-gray-100 text-gray-600 border-gray-200',
    hex: '#6b7280',
  },
}

export default function PodoTrailPage() {
  const { events, isLoading, isError, totalAll } = usePodoTrail()
  const [activeId, setActiveId] = useState<string | null>(null)

  const eventsWithCoords = useMemo(
    () => events.filter((e) => e.coords !== null),
    [events],
  )

  const markers = useMemo<MapMarker[]>(
    () =>
      eventsWithCoords.map((e, i) => ({
        id: e.id,
        lat: e.coords!.lat,
        lng: e.coords!.lng,
        color: SOURCE[e.source].hex,
        label: i + 1,
        popup: <PopupBody event={e} index={i + 1} />,
      })),
    [eventsWithCoords],
  )

  const path = useMemo(
    () => eventsWithCoords.map((e) => ({ lat: e.coords!.lat, lng: e.coords!.lng })),
    [eventsWithCoords],
  )

  const indexById = useMemo(() => {
    const m = new Map<string, number>()
    eventsWithCoords.forEach((e, i) => m.set(e.id, i + 1))
    return m
  }, [eventsWithCoords])

  return (
    <div className="h-full flex flex-col">
      <FilterBar>
        <DateRangeFilter />
        <div className="ml-auto text-xs text-gray-500 tabular-nums">
          {events.length} olay
          {events.length !== totalAll && ` / ${totalAll}`}
          {' · '}
          {eventsWithCoords.length} haritada
        </div>
      </FilterBar>

      <div className="grid grid-cols-[420px_1fr] flex-1 min-h-0">
        <aside className="overflow-y-auto border-r border-gray-100 bg-white">
          {isError && (
            <p className="p-6 text-sm text-red-600">Veri çekilemedi.</p>
          )}
          {!isError && events.length === 0 && !isLoading && (
            <p className="p-6 text-sm text-gray-500">
              Bu filtrelerle Podo'ya ait olay bulunamadı.
            </p>
          )}
          <ol className="relative">
            {events.map((e) => {
              const meta = SOURCE[e.source]
              const Icon = meta.icon
              const idx = indexById.get(e.id)
              const isActive = activeId === e.id
              return (
                <li
                  key={e.id}
                  onMouseEnter={() => setActiveId(e.id)}
                  onMouseLeave={() => setActiveId(null)}
                  className={`relative px-5 py-4 border-b border-gray-100 cursor-default transition-colors ${
                    isActive ? 'bg-indigo-50/40' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${meta.badge}`}
                    >
                      {idx ? (
                        <span className="text-xs font-semibold tabular-nums">
                          {idx}
                        </span>
                      ) : (
                        <Icon size={14} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 border rounded ${meta.badge}`}
                        >
                          {meta.label}
                        </span>
                        <span className="text-xs tabular-nums text-gray-500">
                          {formatDate(e.timestamp)} · {formatTime(e.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {e.title}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                        {e.detail}
                      </p>
                      {e.location && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          📍 {e.location}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </aside>

        <div className="relative bg-gray-50">
          <MapView markers={markers} path={path} pathColor="indigo" />
          {isLoading && <Loader />}
        </div>
      </div>
    </div>
  )
}

function PopupBody({ event, index }: { event: PodoEvent; index: number }) {
  const meta = SOURCE[event.source]
  return (
    <div className="text-xs min-w-[180px]">
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 border rounded ${meta.badge}`}
        >
          #{index} · {meta.label}
        </span>
      </div>
      <div className="font-semibold text-gray-800">{event.title}</div>
      <div className="text-gray-600 mt-0.5">{event.detail}</div>
      <div className="text-gray-400 mt-1">
        {formatDate(event.timestamp)} · {formatTime(event.timestamp)}
      </div>
      {event.location && (
        <div className="text-gray-500 mt-0.5">📍 {event.location}</div>
      )}
    </div>
  )
}

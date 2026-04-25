import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Ruler,
  Gauge,
} from 'lucide-react'
import { FilterBar } from '@/components/filters/FilterBar'
import { PersonFilter } from '@/components/filters/PersonFilter'
import { DateRangeFilter } from '@/components/filters/DateRangeFilter'
import { Loader } from '@/components/Loader'
import { PageContent } from '@/components/PageContent'
import { MapView, type MapMarker } from '@/components/map/MapView'
import { useConflicts } from '@/hooks/useConflicts'
import {
  type Conflict,
  type ConflictEvent,
  type ConflictSeverity,
} from '@/utils/detectConflicts'
import { formatDate, formatTime } from '@/utils/parseTimestamp'

const SEVERITY: Record<
  ConflictSeverity,
  { label: string; tone: string; ring: string; bar: string }
> = {
  critical: {
    label: 'Kesin çelişki',
    tone: 'bg-red-50 text-red-700 border-red-200',
    ring: 'ring-red-200',
    bar: 'bg-red-500',
  },
  high: {
    label: 'Yüksek şüphe',
    tone: 'bg-orange-50 text-orange-700 border-orange-200',
    ring: 'ring-orange-200',
    bar: 'bg-orange-500',
  },
  medium: {
    label: 'Olası çelişki',
    tone: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    ring: 'ring-yellow-200',
    bar: 'bg-yellow-500',
  },
}

const SOURCE_LABEL: Record<ConflictEvent['source'], string> = {
  checkin: 'Check-in',
  sighting: 'Görülme',
  tip: 'İhbar',
}

export default function ConflictsPage() {
  const { conflicts, isLoading, isError } = useConflicts()

  const counts = {
    critical: conflicts.filter((c) => c.severity === 'critical').length,
    high: conflicts.filter((c) => c.severity === 'high').length,
    medium: conflicts.filter((c) => c.severity === 'medium').length,
  }

  return (
    <>
      <FilterBar>
        <PersonFilter label="Kişi" />
        <DateRangeFilter />
        <div className="ml-auto flex items-center gap-2 text-xs">
          <SeverityChip count={counts.critical} severity="critical" />
          <SeverityChip count={counts.high} severity="high" />
          <SeverityChip count={counts.medium} severity="medium" />
        </div>
      </FilterBar>

      <PageContent>
        <div className="relative min-h-[200px]">
          {isError && (
            <p className="text-sm text-red-600">Veri çekilemedi.</p>
          )}

          {!isError && !isLoading && conflicts.length === 0 && (
            <EmptyState />
          )}

          {!isError && conflicts.length > 0 && (
            <ol className="flex flex-col gap-4">
              {conflicts.map((c) => (
                <ConflictCard key={c.id} conflict={c} />
              ))}
            </ol>
          )}

          {isLoading && <Loader />}
        </div>
      </PageContent>
    </>
  )
}

function SeverityChip({
  count,
  severity,
}: {
  count: number
  severity: ConflictSeverity
}) {
  const meta = SEVERITY[severity]
  const dim = count === 0
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${
        dim ? 'bg-gray-50 text-gray-400 border-gray-200' : meta.tone
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dim ? 'bg-gray-300' : meta.bar}`} />
      {meta.label}
      <span className="tabular-nums opacity-80">{count}</span>
    </span>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
        <AlertTriangle className="text-emerald-600" size={20} />
      </div>
      <p className="text-base font-medium text-gray-700">
        Bu filtrelerle çelişki bulunamadı.
      </p>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">
        Aynı kişinin kısa zaman aralığında uzak iki yerde olduğu durumlar
        burada listelenir. Filtreleri genişletmeyi dene.
      </p>
    </div>
  )
}

function ConflictCard({ conflict }: { conflict: Conflict }) {
  const meta = SEVERITY[conflict.severity]
  const [mapOpen, setMapOpen] = useState(false)

  const speedDisplay = Number.isFinite(conflict.speedKmh)
    ? `${Math.round(conflict.speedKmh)} km/h`
    : 'aynı an, farklı yer'

  const markers: MapMarker[] = [
    {
      id: conflict.a.id,
      lat: conflict.a.coords.lat,
      lng: conflict.a.coords.lng,
      color: '#4f46e5',
      label: 'A',
    },
    {
      id: conflict.b.id,
      lat: conflict.b.coords.lat,
      lng: conflict.b.coords.lng,
      color: '#dc2626',
      label: 'B',
    },
  ]

  return (
    <li
      className={`bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ring-1 ${meta.ring}`}
    >
      <div className="flex items-stretch">
        <div className={`w-1 ${meta.bar}`} />
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold uppercase tracking-wide ${meta.tone}`}
              >
                <AlertTriangle size={11} />
                {meta.label}
              </span>
              <h3 className="text-base font-semibold text-gray-800">
                {conflict.personName}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <Stat icon={Ruler} value={`${conflict.distanceKm.toFixed(2)} km`} />
              <Stat
                icon={Clock}
                value={formatMinutes(conflict.minutesApart)}
              />
              <Stat icon={Gauge} value={speedDisplay} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-3">
            <EventBlock event={conflict.a} side="A" />
            <div className="hidden md:flex items-center justify-center text-gray-400">
              <ArrowRight size={20} />
            </div>
            <EventBlock event={conflict.b} side="B" />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMapOpen((v) => !v)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <MapPin size={12} />
              {mapOpen ? 'Haritayı gizle' : 'İki konumu haritada gör'}
            </button>
          </div>

          {mapOpen && (
            <div className="mt-3 h-64 rounded-md overflow-hidden border border-gray-200">
              <MapView markers={markers} path={[
                { lat: conflict.a.coords.lat, lng: conflict.a.coords.lng },
                { lat: conflict.b.coords.lat, lng: conflict.b.coords.lng },
              ]} pathColor="red" />
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

function Stat({
  icon: Icon,
  value,
}: {
  icon: typeof Ruler
  value: string
}) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      <Icon size={12} className="text-gray-400" />
      {value}
    </span>
  )
}

function EventBlock({
  event,
  side,
}: {
  event: ConflictEvent
  side: 'A' | 'B'
}) {
  const dotColor = side === 'A' ? 'bg-indigo-500' : 'bg-red-500'
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={`w-5 h-5 rounded-full ${dotColor} text-white text-[10px] font-bold flex items-center justify-center`}
        >
          {side}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {SOURCE_LABEL[event.source]}
        </span>
        {event.confidence && (
          <span className="text-[10px] uppercase tracking-wide text-gray-400">
            {event.confidence}
          </span>
        )}
      </div>
      <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
        <MapPin size={12} className="text-gray-400" />
        {event.location}
      </div>
      <div className="text-xs text-gray-500 tabular-nums mt-0.5">
        {formatDate(event.timestamp)} · {formatTime(event.timestamp)}
      </div>
      {event.detail && (
        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
          {event.detail}
        </div>
      )}
    </div>
  )
}

function formatMinutes(total: number): string {
  if (total === 0) return 'aynı dakika'
  if (total < 60) return `${total} dk`
  const h = Math.floor(total / 60)
  const m = total % 60
  if (m === 0) return `${h} sa`
  return `${h} sa ${m} dk`
}

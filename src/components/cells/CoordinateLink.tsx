import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { parseCoordinates } from '@/utils/parseCoordinates'
import { MapModal } from '@/components/map/MapModal'

type Props = {
  coords: string
  label?: string
  subtitle?: string
}

export function CoordinateLink({ coords, label, subtitle }: Props) {
  const [open, setOpen] = useState(false)
  const parsed = parseCoordinates(coords)

  if (!parsed) {
    return <span className="font-mono text-xs text-gray-400">{coords || '—'}</span>
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 font-mono text-xs text-gray-600 hover:text-indigo-700 hover:underline"
        title="Haritada göster"
      >
        <MapPin size={12} className="text-indigo-500 shrink-0" />
        <span>{coords}</span>
      </button>
      <MapModal
        open={open}
        onClose={() => setOpen(false)}
        title={label || 'Konum'}
        subtitle={subtitle}
        markers={[
          {
            id: coords,
            lat: parsed.lat,
            lng: parsed.lng,
            popup: (
              <div className="text-xs">
                {label && <div className="font-semibold text-gray-800">{label}</div>}
                {subtitle && <div className="text-gray-600">{subtitle}</div>}
                <div className="font-mono text-gray-500 mt-1">{coords}</div>
              </div>
            ),
          },
        ]}
      />
    </>
  )
}

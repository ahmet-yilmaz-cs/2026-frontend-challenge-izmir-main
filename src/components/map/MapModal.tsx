import { useEffect } from 'react'
import { X } from 'lucide-react'
import { MapView, type MapMarker } from './MapView'

type MapModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  markers: MapMarker[]
}

export function MapModal({ open, onClose, title, subtitle, markers }: MapModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1">
          <MapView markers={markers} />
        </div>
      </div>
    </div>
  )
}

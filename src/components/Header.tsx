import { useLocation } from 'react-router-dom'

type PageMeta = {
  title: string
  subtitle: string
}

const PAGE_META: Record<string, PageMeta> = {
  '/checkins': {
    title: 'Check-ins',
    subtitle: 'Konum bildirimleri ve zaman damgaları',
  },
  '/messages': {
    title: 'Messages',
    subtitle: 'Kişiler arası yazışmalar',
  },
  '/sightings': {
    title: 'Sightings',
    subtitle: 'Görgü tanıkları ve birlikte görülmeler',
  },
  '/notes': {
    title: 'Personal Notes',
    subtitle: 'Kişisel günlük girişleri',
  },
  '/tips': {
    title: 'Anonymous Tips',
    subtitle: 'Anonim ihbarlar ve şüpheliler',
  },
}

export function Header() {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname]

  return (
    <header className="bg-white border-b border-gray-100 px-12 py-3 flex items-center justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-gray-800 leading-tight truncate">
          {meta?.title ?? 'Podo Soruşturması'}
        </h2>
        {meta?.subtitle && (
          <p className="text-sm text-gray-500 truncate">{meta.subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Vaka #001 · Aktif
        </span>
      </div>
    </header>
  )
}

import { NavLink, useLocation } from 'react-router-dom'
import {
  MapPin,
  MessageSquare,
  Eye,
  StickyNote,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { useCheckins } from '@/hooks/useCheckins'
import { useMessages } from '@/hooks/useMessages'
import { useSightings } from '@/hooks/useSightings'
import { usePersonalNotes } from '@/hooks/usePersonalNotes'
import { useAnonymousTips } from '@/hooks/useAnonymousTips'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  count?: number
}

const PRESERVED_KEYS = [
  'person',
  'q',
  'date',
  'timeFrom',
  'timeTo',
  'location',
  'confidence',
] as const

function preserveSearch(currentSearch: string): string {
  const src = new URLSearchParams(currentSearch)
  const next = new URLSearchParams()
  for (const key of PRESERVED_KEYS) {
    const v = src.get(key)
    if (v) next.set(key, v)
  }
  const qs = next.toString()
  return qs ? `?${qs}` : ''
}

export function MainNav() {
  const { data: checkins } = useCheckins()
  const { data: messages } = useMessages()
  const { data: sightings } = useSightings()
  const { data: notes } = usePersonalNotes()
  const { data: tips } = useAnonymousTips()
  const location = useLocation()
  const search = preserveSearch(location.search)

  const items: NavItem[] = [
    { to: '/checkins', label: 'Giriş Kayıtları', icon: MapPin, count: checkins?.length },
    { to: '/messages', label: 'Mesajlar', icon: MessageSquare, count: messages?.length },
    { to: '/sightings', label: 'Görülmeler', icon: Eye, count: sightings?.length },
    { to: '/notes', label: 'Kişisel Notlar', icon: StickyNote, count: notes?.length },
    { to: '/tips', label: 'Anonim İhbarlar', icon: AlertTriangle, count: tips?.length },
  ]

  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {items.map(({ to, label, icon: Icon, count }) => (
          <li key={to}>
            <NavLink
              to={{ pathname: to, search }}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 rounded-md text-base font-medium transition-all group ${
                  isActive
                    ? 'bg-gray-50 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    className={`transition-colors ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span className="flex-1">{label}</span>
                  {count !== undefined && (
                    <span
                      className={`text-xs tabular-nums px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

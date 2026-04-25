import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

export function Logo() {
  return (
    <Link
      to="/"
      className="flex flex-col items-center gap-2 text-center hover:opacity-80 transition-opacity"
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm">
        <Search size={26} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 tracking-tight">
          PODO
        </p>
        <p className="text-[11px] text-gray-500 -mt-0.5">SORUŞTURMASI</p>
      </div>
    </Link>
  )
}

import { Logo } from './Logo'
import { MainNav } from './MainNav'

export function Sidebar() {
  return (
    <aside className="row-span-full bg-white border-r border-gray-100 px-6 py-12 flex flex-col gap-12">
      <Logo />
      <MainNav />
    </aside>
  )
}

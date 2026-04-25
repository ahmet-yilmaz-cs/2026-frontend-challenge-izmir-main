import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function AppShell() {
  return (
    <div
      className="grid h-screen text-gray-700 bg-gray-50"
      style={{
        gridTemplateColumns: '17rem 1fr',
        gridTemplateRows: 'auto 1fr',
      }}
    >
      <Sidebar />
      <Header />
      <main className="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

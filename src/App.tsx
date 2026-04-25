import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/AppShell'
import HomePage from '@/pages/HomePage'
import CheckinsPage from '@/pages/CheckinsPage'
import MessagesPage from '@/pages/MessagesPage'
import SightingsPage from '@/pages/SightingsPage'
import PersonalNotesPage from '@/pages/PersonalNotesPage'
import AnonymousTipsPage from '@/pages/AnonymousTipsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<AppShell />}>
          <Route path="/checkins" element={<CheckinsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/sightings" element={<SightingsPage />} />
          <Route path="/notes" element={<PersonalNotesPage />} />
          <Route path="/tips" element={<AnonymousTipsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

import {
  normalizeCheckin,
  normalizeMessage,
  normalizeSighting,
  normalizePersonalNote,
  normalizeAnonymousTip,
  type RawSubmission,
} from './normalizer'
import type { Checkin, Message, Sighting, PersonalNote, AnonymousTip } from '@/types'

const BASE = import.meta.env.VITE_JOTFORM_API_BASE
const API_KEY = import.meta.env.VITE_JOTFORM_API_KEY_1

async function fetchSubmissions(formId: string): Promise<RawSubmission[]> {
  const url = `${BASE}/form/${formId}/submissions?apiKey=${API_KEY}&limit=100&orderby=created_at&direction=ASC`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`JotForm API error: ${res.status}`)
  const data = await res.json()
  return data.content ?? []
}

export async function fetchCheckins(): Promise<Checkin[]> {
  const raw = await fetchSubmissions(import.meta.env.VITE_FORM_CHECKINS)
  return raw.map(normalizeCheckin)
}

export async function fetchMessages(): Promise<Message[]> {
  const raw = await fetchSubmissions(import.meta.env.VITE_FORM_MESSAGES)
  return raw.map(normalizeMessage)
}

export async function fetchSightings(): Promise<Sighting[]> {
  const raw = await fetchSubmissions(import.meta.env.VITE_FORM_SIGHTINGS)
  return raw.map(normalizeSighting)
}

export async function fetchPersonalNotes(): Promise<PersonalNote[]> {
  const raw = await fetchSubmissions(import.meta.env.VITE_FORM_PERSONAL_NOTES)
  return raw.map(normalizePersonalNote)
}

export async function fetchAnonymousTips(): Promise<AnonymousTip[]> {
  const raw = await fetchSubmissions(import.meta.env.VITE_FORM_ANONYMOUS_TIPS)
  return raw.map(normalizeAnonymousTip)
}

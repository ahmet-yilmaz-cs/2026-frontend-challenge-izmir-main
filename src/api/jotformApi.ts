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

const PAGE_SIZE = 1000

/**
 * Fetch ALL submissions for a form, paginating with offset until empty.
 * JotForm caps a single response at ~1000; for safety we loop.
 */
async function fetchSubmissions(formId: string): Promise<RawSubmission[]> {
  const all: RawSubmission[] = []
  let offset = 0

  while (true) {
    const url = `${BASE}/form/${formId}/submissions?apiKey=${API_KEY}&limit=${PAGE_SIZE}&offset=${offset}&orderby=created_at&direction=ASC`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`JotForm API error: ${res.status}`)
    const data = await res.json()
    const page: RawSubmission[] = data.content ?? []
    all.push(...page)
    if (page.length < PAGE_SIZE) break
    offset += PAGE_SIZE
  }

  return all
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

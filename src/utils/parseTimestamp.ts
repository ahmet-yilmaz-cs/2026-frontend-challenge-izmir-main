import { parse, isValid } from 'date-fns'

const FORMAT = 'dd-MM-yyyy HH:mm'

export function parseTimestamp(raw: string): Date {
  const parsed = parse(raw, FORMAT, new Date())
  return isValid(parsed) ? parsed : new Date(0)
}

export function formatTime(raw: string): string {
  const date = parseTimestamp(raw)
  if (date.getTime() === 0) return raw
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(raw: string): string {
  const date = parseTimestamp(raw)
  if (date.getTime() === 0) return raw
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function compareTimestamps(a: string, b: string): number {
  return parseTimestamp(a).getTime() - parseTimestamp(b).getTime()
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

function isoDateOf(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function minutesOf(d: Date): number {
  return d.getHours() * 60 + d.getMinutes()
}

function parseHm(hm: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hm.trim())
  if (!m) return null
  const h = Number.parseInt(m[1], 10)
  const min = Number.parseInt(m[2], 10)
  if (!Number.isFinite(h) || !Number.isFinite(min)) return null
  if (h < 0 || h > 23 || min < 0 || min > 59) return null
  return h * 60 + min
}

/**
 * Filter a timestamp by:
 *  - exact day (date = YYYY-MM-DD), and/or
 *  - time-of-day range (timeFrom / timeTo as HH:MM)
 *
 * Time range supports wrap-around midnight (22:00 → 02:00).
 */
export function matchesDateAndTime(
  timestamp: string,
  date?: string,
  timeFrom?: string,
  timeTo?: string,
): boolean {
  if (!date && !timeFrom && !timeTo) return true
  const d = parseTimestamp(timestamp)
  if (d.getTime() === 0) return true

  if (date && isoDateOf(d) !== date) return false

  const from = timeFrom ? parseHm(timeFrom) : null
  const to = timeTo ? parseHm(timeTo) : null
  if (from === null && to === null) return true

  const t = minutesOf(d)
  const lo = from ?? 0
  const hi = to ?? 24 * 60 - 1

  if (lo <= hi) return t >= lo && t <= hi
  // wrap-around (e.g., 22:00 - 02:00)
  return t >= lo || t <= hi
}

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

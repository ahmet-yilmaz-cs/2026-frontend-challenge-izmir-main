export type Coords = { lat: number; lng: number }

/**
 * Parse a "lat,lng" string. Tolerates extra whitespace, alternate separators.
 * Returns null for invalid / out-of-range coordinates.
 */
export function parseCoordinates(raw: string | undefined): Coords | null {
  if (!raw) return null
  const cleaned = raw.trim()
  if (!cleaned) return null

  const match = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/)
  if (!match) return null

  const lat = Number.parseFloat(match[1])
  const lng = Number.parseFloat(match[2])
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90) return null
  if (lng < -180 || lng > 180) return null

  return { lat, lng }
}

export function isValidCoordinate(raw: string | undefined): boolean {
  return parseCoordinates(raw) !== null
}

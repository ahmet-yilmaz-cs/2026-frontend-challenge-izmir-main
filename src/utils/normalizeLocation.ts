/**
 * Canonical İzmir location names. Keys are normalizeLocationKey() outputs.
 * Multiple keys (e.g., with/without Turkish possessive suffix, or with/without
 * Turkish diacritics) map to the same canonical form so the dropdown collapses
 * variants like "Asansor" / "Asansör" or "Alsancak Kordon" / "Alsancak Kordonu".
 */
const LOCATION_ALIASES: Record<string, string> = {
  'alsancak gar': 'Alsancak Garı',
  'alsancak gari': 'Alsancak Garı',
  'alsancak kordon': 'Alsancak Kordonu',
  'alsancak kordonu': 'Alsancak Kordonu',
  asansor: 'Asansör',
  'bornova kucukpark': 'Bornova Küçükpark',
  'bostanli sahil': 'Bostanlı Sahili',
  'bostanli sahili': 'Bostanlı Sahili',
  'guzelyali sahil': 'Güzelyalı Sahili',
  'guzelyali sahili': 'Güzelyalı Sahili',
  'karsiyaka iskele': 'Karşıyaka İskelesi',
  'karsiyaka iskelesi': 'Karşıyaka İskelesi',
  'konak meydani': 'Konak Meydanı',
  'konak pier': 'Konak Pier',
  kulturpark: 'Kültürpark',
}

/**
 * Build a comparison key:
 *  - Trim
 *  - NFD decompose (Ç → C + cedilla, Ö → O + diaeresis, etc.)
 *  - Strip combining marks (\p{M})
 *  - Map Turkish dotless ı / dotted İ → i (NFD does not decompose ı/İ → i)
 *  - Strip non-letter/number characters
 *  - Lowercase + collapse whitespace
 */
function normalizeLocationKey(s: string): string {
  return s
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeLocation(raw: string): string {
  if (!raw) return ''
  const key = normalizeLocationKey(raw)
  return LOCATION_ALIASES[key] ?? raw.trim()
}

export function isSameLocation(a: string, b: string): boolean {
  if (!a || !b) return a === b
  return normalizeLocation(a) === normalizeLocation(b)
}

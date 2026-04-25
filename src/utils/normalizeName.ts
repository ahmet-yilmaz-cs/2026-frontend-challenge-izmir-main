const ALIASES: Record<string, string> = {
  alican: 'Alican',
  alicann: 'Alican',
  ayca: 'Ayça',
  idil: 'İdil',
  basak: 'Başak',
  podo: 'Podo',
  cem: 'Cem',
  ege: 'Ege',
  ela: 'Ela',
  can: 'Can',
  fatih: 'Fatih',
  mert: 'Mert',
  simge: 'Simge',
  furkan: 'Furkan',
}

/**
 * Convert any spelling/casing/punctuation variant to a comparison key:
 * - Trim
 * - NFD decompose (Ç → C + cedilla, İ → I + dot above, ş → s + cedilla)
 * - Strip combining marks (\p{M})
 * - Strip non-letter/number characters ("Podo?" → "Podo", "Cem!" → "Cem")
 * - Lowercase (safe — only Latin letters/digits remain)
 *
 * Handles JS edge case: "İ".toLowerCase() yields "i̇" (i + combining dot) on
 * non-Turkish locales; without strip, that key would never match "idil".
 */
function normalizeKey(s: string): string {
  return s
    .trim()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .toLowerCase()
    .trim()
}

export function normalizeName(raw: string): string {
  if (!raw) return ''
  const key = normalizeKey(raw)
  return ALIASES[key] ?? raw.trim()
}

/**
 * Normalize a field that may contain multiple names joined by common
 * delimiters: comma, semicolon, ampersand, plus, "and", "ve".
 * Each part is independently normalized; result is joined with ", ".
 */
export function normalizeNameList(raw: string): string {
  if (!raw) return ''
  const parts = raw.split(/\s*(?:,|;|&|\+|\bve\b|\band\b)\s*/i)
  const cleaned = parts.map((p) => normalizeName(p)).filter(Boolean)
  return cleaned.join(', ')
}

export function isSamePerson(a: string, b: string): boolean {
  return normalizeName(a) === normalizeName(b)
}

/**
 * Detect low-quality / junk submissions like "ss", "dd", "gg", "11", "...".
 * Heuristic:
 *  - empty / whitespace
 *  - shorter than 3 characters
 *  - contains no letter at all
 *  - all letters are the same character ("sss", "aaaa")
 */
export function isJunkName(raw: string): boolean {
  const name = raw?.trim() ?? ''
  if (!name) return true
  if (name.length < 3) return true
  if (!/\p{L}/u.test(name)) return true
  const letters = name.toLowerCase().replace(/[^\p{L}]/gu, '')
  if (letters.length > 0 && new Set(letters).size === 1) return true
  return false
}

export function getUniqueNames(names: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const name of names) {
    if (!name) continue
    const normalized = normalizeName(name)
    if (!seen.has(normalized)) {
      seen.add(normalized)
      result.push(normalized)
    }
  }
  return result.sort((a, b) => a.localeCompare(b, 'tr-TR'))
}

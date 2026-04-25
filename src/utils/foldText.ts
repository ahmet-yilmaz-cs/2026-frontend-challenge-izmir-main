/**
 * Diacritic-insensitive Turkish-aware text fold for fuzzy search.
 *
 * Maps:
 *  ç → c, ş → s, ğ → g, ü → u, ö → o, İ/I → i, ı → i
 *  All other diacritics stripped via NFD + combining mark removal.
 *
 * Preserves whitespace, digits, punctuation so substring search keeps working.
 *
 * Examples:
 *  foldText("Kültürpark") === "kulturpark"
 *  foldText("İdil")        === "idil"
 *  foldText("ALSANCAK")    === "alsancak"
 *  foldText("Selin'i")     === "selin'i"
 */
export function foldText(s: string): string {
  if (!s) return ''
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ı/g, 'i')
}

/**
 * Substring match where both haystack and needle are folded — diacritic
 * differences and Turkish casing edge cases are ignored.
 */
export function foldedIncludes(haystack: string, needle: string): boolean {
  if (!needle) return true
  if (!haystack) return false
  return foldText(haystack).includes(foldText(needle))
}

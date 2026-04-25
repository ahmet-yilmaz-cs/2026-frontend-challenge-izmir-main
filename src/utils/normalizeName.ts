const ALIASES: Record<string, string> = {
  alican: 'Alican',
  alicann: 'Alican',
  ayca: 'Ayça',
  ayça: 'Ayça',
  idil: 'İdil',
  başak: 'Başak',
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

export function normalizeName(raw: string): string {
  const key = raw.trim().toLowerCase()
  return ALIASES[key] ?? raw.trim()
}

export function isSamePerson(a: string, b: string): boolean {
  return normalizeName(a) === normalizeName(b)
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

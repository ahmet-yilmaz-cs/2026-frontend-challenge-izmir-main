import type { Checkin, Message, Sighting, PersonalNote, AnonymousTip } from '@/types'

type RawAnswer = {
  name: string
  answer?: string
  type?: string
}

export type RawSubmission = {
  id: string
  answers: Record<string, RawAnswer>
}

function getAnswer(answers: Record<string, RawAnswer>, fieldName: string): string {
  const entry = Object.values(answers).find((a) => a.name === fieldName)
  return entry?.answer ?? ''
}

export function normalizeCheckin(sub: RawSubmission): Checkin {
  return {
    id: sub.id,
    fullName: getAnswer(sub.answers, 'fullname'),
    location: getAnswer(sub.answers, 'location'),
    coordinates: getAnswer(sub.answers, 'coordinates'),
    timestamp: getAnswer(sub.answers, 'timestamp'),
    note: getAnswer(sub.answers, 'note'),
  }
}

export function normalizeMessage(sub: RawSubmission): Message {
  return {
    id: sub.id,
    from: getAnswer(sub.answers, 'from'),
    to: getAnswer(sub.answers, 'to'),
    message: getAnswer(sub.answers, 'message'),
    timestamp: getAnswer(sub.answers, 'timestamp'),
  }
}

export function normalizeSighting(sub: RawSubmission): Sighting {
  return {
    id: sub.id,
    personName: getAnswer(sub.answers, 'personname'),
    seenWith: getAnswer(sub.answers, 'seenwith'),
    location: getAnswer(sub.answers, 'location'),
    coordinates: getAnswer(sub.answers, 'coordinates'),
    timestamp: getAnswer(sub.answers, 'timestamp'),
    note: getAnswer(sub.answers, 'note'),
  }
}

export function normalizePersonalNote(sub: RawSubmission): PersonalNote {
  return {
    id: sub.id,
    fullName: getAnswer(sub.answers, 'fullname'),
    note: getAnswer(sub.answers, 'note'),
    timestamp: getAnswer(sub.answers, 'timestamp'),
  }
}

export function normalizeAnonymousTip(sub: RawSubmission): AnonymousTip {
  return {
    id: sub.id,
    suspectName: getAnswer(sub.answers, 'suspectname'),
    location: getAnswer(sub.answers, 'location'),
    coordinates: getAnswer(sub.answers, 'coordinates'),
    timestamp: getAnswer(sub.answers, 'timestamp'),
    tip: getAnswer(sub.answers, 'tip'),
    confidence: (getAnswer(sub.answers, 'confidence') as AnonymousTip['confidence']) || 'low',
  }
}

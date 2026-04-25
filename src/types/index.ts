export interface Checkin {
  id: string
  fullName: string
  location: string
  coordinates: string
  timestamp: string
  note: string
}

export interface Message {
  id: string
  from: string
  to: string
  message: string
  timestamp: string
}

export interface Sighting {
  id: string
  personName: string
  seenWith: string
  location: string
  coordinates: string
  timestamp: string
  note: string
}

export interface PersonalNote {
  id: string
  fullName: string
  note: string
  timestamp: string
}

export interface AnonymousTip {
  id: string
  suspectName: string
  location: string
  coordinates: string
  timestamp: string
  tip: string
  confidence: 'low' | 'medium' | 'high'
}

export type CircuitCategory = 'official' | 'special'

export interface CircuitHighlight {
  id: string
  label: string
  name: string
  sector: string
  description: string
  x: number
  y: number
}

export interface CircuitChallenge {
  label: string
  value: string
}

export interface Circuit {
  id: string
  name: string
  officialName: string
  city: string
  country: string
  category: CircuitCategory
  season: number | null
  round: number | null
  summary: string
  history: string
  character: string
  trackPath: string
  trackViewBox: string
  challenges: CircuitChallenge[]
  highlights: CircuitHighlight[]
}

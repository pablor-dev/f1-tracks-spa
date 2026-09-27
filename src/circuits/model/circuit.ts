export type CircuitCategory = 'official' | 'special'

export type CircuitStatus = 'current' | 'special' | 'historic'

export type HotspotType = 'corner' | 'chicane' | 'braking-zone' | 'high-speed' | 'overtaking' | 'elevation' | 'historic' | 'technical'

export interface TrackHotspot {
  id: string
  label: string
  title: string
  type: HotspotType
  progress?: number
  cornerNumber?: number
  sector?: number
  description: string
  extendedDescription?: string
}

export interface CircuitTheme {
  backgroundImage: string
  backgroundAlt: string
  backgroundPosition?: string
  visualTreatment?: string
}

export interface CircuitTrack {
  finishLineProgress?: number
  mapImage: string | null
  hotspots: TrackHotspot[]
  representation: 'verified' | 'unavailable'
  referenceCoverage: 'curve-reference' | 'track-only'
}

export interface ImageCredits {
  author?: string
  source?: string
  sourceUrl?: string
  license?: string
  licenseUrl?: string
}

export interface Circuit {
  id: string
  slug: string
  name: string
  officialName: string
  city: string
  country: string
  countryCode: string
  category: CircuitCategory
  status: CircuitStatus
  season?: number
  round?: number
  summary: string
  history: string
  challenges: string[]
  theme: CircuitTheme
  track: CircuitTrack
  imageCredits?: ImageCredits
}

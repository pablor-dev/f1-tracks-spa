export type CircuitCategory = 'official' | 'special'

export type CircuitStatus = 'current' | 'special' | 'historic'

export type HotspotType = 'corner' | 'chicane' | 'braking-zone' | 'high-speed' | 'overtaking' | 'elevation' | 'historic' | 'technical'

export interface TrackHotspot {
  id: string
  label: string
  title: string
  type: HotspotType
  position: { x: number; y: number }
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
  svg: string
  viewBox: string
  hotspots: TrackHotspot[]
  representation: 'provisional' | 'verified'
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

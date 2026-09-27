export interface TrackZone {
  id: 1 | 2 | 3
  label: string
  start: number
  end: number
}

export const trackZones: readonly TrackZone[] = [
  { id: 1, label: 'Zona 1', start: 0, end: 33.333 },
  { id: 2, label: 'Zona 2', start: 33.333, end: 66.666 },
  { id: 3, label: 'Zona 3', start: 66.666, end: 100 },
]

// Progress values are measured on the primary path in our SVGs. They were
// registered against the numbered-turn references, not distributed evenly.
export const hotspotProgressByCircuitId: Readonly<Record<string, readonly number[]>> = {
  'albert-park': [11.6, 62.6, 74.6],
  suzuka: [72.9, 87.9, 0.9, 14.9, 33.9, 44.9],
  miami: [3.7, 54.7, 77.7],
  montreal: [43.2, 97.2, 27.2],
  monaco: [32.3, 56.3, 82.3],
  barcelona: [91.9, 4.9, 47.9],
  'red-bull-ring': [86.7, 63.7, 3.7],
  silverstone: [26, 50, 69],
  spa: [97.3, 6.3, 9.3, 17.3, 46.3, 78.3],
  hungaroring: [91.1, 13.1, 29.1],
  zandvoort: [13.1, 54.1, 96.1],
  monza: [74.4, 89.4, 0.4, 15.4, 32.4, 53.4],
  baku: [2.8, 37.8, 65.8],
  singapore: [11.7, 28.7, 70.7],
  austin: [73, 87, 27],
  mexico: [8.9, 40.9, 68.9],
  interlagos: [26.3, 57.3, 91.3],
  'las-vegas': [51.8, 2.8, 22.8],
  lusail: [1, 20, 64],
  'yas-marina': [33, 6, 81],
  bahrain: [84.1, 35.1, 17.1],
  jeddah: [6.6, 50.6, 82.6],
  imola: [1.9, 45.9, 77.9],
  shanghai: [9.6, 76.6, 31.6],
  madring: [80.2, 11.2, 46.2],
  sepang: [67.8, 43.8, 83.8],
  galvez: [18, 55, 82],
}

export const finishLineProgressByCircuitId: Readonly<Record<string, number>> = {
  'albert-park': 7.6,
  shanghai: 14.6,
  suzuka: 57.9,
  miami: 99.7,
  montreal: 39.2,
  monaco: 29.3,
  barcelona: 87.9,
  'red-bull-ring': 91.7,
  silverstone: 95,
  spa: 94.3,
  hungaroring: 87.1,
  zandvoort: 9.1,
  monza: 69.4,
  madring: 68.2,
  baku: 98.8,
  sepang: 71.8,
  singapore: 5.7,
  austin: 69,
  mexico: 4.9,
  interlagos: 21.3,
  'las-vegas': 47.8,
  lusail: 97,
  'yas-marina': 37,
  bahrain: 88.1,
  jeddah: 2.4,
  imola: 94,
  galvez: 0,
}

export function hasCurveReference(circuitId: string): boolean {
  return circuitId in hotspotProgressByCircuitId
}

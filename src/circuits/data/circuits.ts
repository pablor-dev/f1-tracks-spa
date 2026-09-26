import type { Circuit } from '../model/circuit'

export const circuits: Circuit[] = [
  {
    id: 'albert-park', name: 'Albert Park', officialName: 'Circuito de Albert Park', city: 'Melbourne', country: 'Australia',
    category: 'official', season: 2026, round: 1,
    summary: 'Un trazado semipermanente rápido y fluido que bordea el lago de Albert Park y abre la temporada.',
    history: 'Melbourne recibe a la Fórmula 1 desde 1996. La evolución reciente del trazado eliminó chicanas y amplió curvas para favorecer vueltas más veloces y carreras con mayor continuidad.',
    character: 'Semipermanente · Alta velocidad', trackViewBox: '0 0 640 390',
    trackPath: 'M97 279C62 223 84 139 149 111c43-19 71-65 126-66 43-1 65 35 105 42 70 13 139-24 172 34 27 48-11 90-5 139 7 54-34 87-87 79-64-9-105 15-162 0-45-12-64-54-105-58-33-3-74 30-96-2Z',
    challenges: [
      { label: 'Clave', value: 'Confianza en apoyo' }, { label: 'Exigencia', value: 'Frenadas rápidas' }, { label: 'Ritmo', value: 'Fluido' },
    ],
    highlights: [
      { id: 'albert-park-1', label: 'T1', name: 'Jones', sector: 'Sector 1', description: 'La primera frenada exige precisión con el auto cargado y el pelotón todavía compacto.', x: 118, y: 278 },
      { id: 'albert-park-9', label: 'T9–10', name: 'Cambio de dirección', sector: 'Sector 2', description: 'Una secuencia veloz donde la estabilidad aerodinámica define la confianza del piloto.', x: 515, y: 107 },
      { id: 'albert-park-11', label: 'T11', name: 'Frenada técnica', sector: 'Sector 3', description: 'El auto llega con alta velocidad y debe rotar sin castigar el neumático delantero.', x: 445, y: 332 },
    ],
  },
  {
    id: 'shanghai', name: 'Shanghai', officialName: 'Circuito Internacional de Shanghai', city: 'Shanghai', country: 'China',
    category: 'official', season: 2026, round: 2,
    summary: 'Curvas que se cierran sobre sí mismas, una recta extensa y una mezcla exigente de tracción y carga lateral.',
    history: 'Diseñado por Hermann Tilke e inaugurado en 2004, su silueta se inspira en el carácter chino shàng. Es una prueba completa para puesta a punto y gestión de neumáticos.',
    character: 'Permanente · Técnica y tracción', trackViewBox: '0 0 640 390',
    trackPath: 'M172 94c-43 25-67 80-37 116 25 29 76 3 67-33-8-30-50-8-38-50 13-48 93-69 141-44 45 24 56 81 103 97 43 15 66-27 105-9 36 16 29 68 1 91-47 40-118 40-168 8-42-26-101 8-150-9-44-16-72-67-43-106Z',
    challenges: [
      { label: 'Clave', value: 'Neumático delantero' }, { label: 'Exigencia', value: 'Tracción' }, { label: 'Ritmo', value: 'Variable' },
    ],
    highlights: [
      { id: 'shanghai-1', label: 'T1–2', name: 'Caracol', sector: 'Sector 1', description: 'Una curva prolongada que se cierra y pone al límite la adherencia delantera.', x: 156, y: 101 },
      { id: 'shanghai-7', label: 'T7–8', name: 'Ese de alta velocidad', sector: 'Sector 2', description: 'El equilibrio y la precisión sostienen la velocidad en un cambio de apoyo continuo.', x: 383, y: 190 },
      { id: 'shanghai-14', label: 'T14', name: 'Horquilla', sector: 'Sector 3', description: 'La frenada más fuerte llega al final de la recta principal de adelantamiento.', x: 506, y: 288 },
    ],
  },
  {
    id: 'suzuka', name: 'Suzuka', officialName: 'Circuito de Suzuka', city: 'Suzuka', country: 'Japón',
    category: 'official', season: 2026, round: 3,
    summary: 'El único trazado en forma de ocho del calendario: rápido, estrecho y celebrado por su ritmo ininterrumpido.',
    history: 'Nació en 1962 como pista de pruebas de Honda. Su combinación de curvas enlazadas, desnivel y escaso margen de error la convirtió en una referencia técnica de la Fórmula 1.',
    character: 'Permanente · Alta carga', trackViewBox: '0 0 640 390',
    trackPath: 'M84 275c55-25 89-92 142-110 50-17 108-5 147 31 44 41 66 113 135 105 48-5 71-63 40-100-37-45-105-20-151-42-48-23-62-80-117-91-59-12-127 21-146 77-12 35 4 61 50 40Z M239 166c33 36 72 69 120 68 48 0 86-29 132-33',
    challenges: [
      { label: 'Clave', value: 'Ritmo y precisión' }, { label: 'Exigencia', value: 'Carga lateral' }, { label: 'Ritmo', value: 'Muy rápido' },
    ],
    highlights: [
      { id: 'suzuka-s', label: 'T3–7', name: 'Las eses', sector: 'Sector 1', description: 'Cada vértice prepara el siguiente; un pequeño error compromete toda la secuencia.', x: 166, y: 165 },
      { id: 'suzuka-8', label: 'T8', name: 'Degner', sector: 'Sector 2', description: 'Dos ápices rápidos con poco margen y una salida que exige máxima precisión.', x: 337, y: 189 },
      { id: 'suzuka-15', label: 'T15', name: '130R', sector: 'Sector 3', description: 'Una curva icónica de altísima velocidad que expone el balance aerodinámico.', x: 520, y: 284 },
    ],
  },
  {
    id: 'galvez', name: 'Oscar y Juan Gálvez', officialName: 'Autódromo Oscar y Juan Gálvez', city: 'Buenos Aires', country: 'Argentina',
    category: 'special', season: null, round: null,
    summary: 'Un emblema del automovilismo argentino con múltiples configuraciones y una historia propia en la Fórmula 1.',
    history: 'Inaugurado en 1952, fue escenario del Gran Premio de Argentina en distintas etapas entre 1953 y 1998. Sus variantes acompañaron varias generaciones técnicas del campeonato.',
    character: 'Histórico · Múltiples variantes', trackViewBox: '0 0 640 390',
    trackPath: 'M95 261c53-16 82-63 131-87 62-30 126-4 183-34 49-26 102-55 138-12 31 37 5 90-38 105-48 17-94-10-138 8-51 20-69 78-126 78-43 0-84-26-89-58-5-29 25-42 62-52Z',
    challenges: [
      { label: 'Clave', value: 'Adaptación' }, { label: 'Exigencia', value: 'Frenada y tracción' }, { label: 'Identidad', value: 'Histórica' },
    ],
    highlights: [
      { id: 'galvez-curvon', label: 'Curvón', name: 'Curvón Salotto', sector: 'Sector veloz', description: 'Una referencia del trazado más extenso, recordada por su velocidad y compromiso.', x: 521, y: 145 },
      { id: 'galvez-mixtos', label: 'Mixtos', name: 'Sector mixto', sector: 'Zona técnica', description: 'Cambios de dirección y tracción donde el auto debe responder con agilidad.', x: 296, y: 164 },
      { id: 'galvez-horquilla', label: 'Horquilla', name: 'Horquilla', sector: 'Sector final', description: 'Una frenada profunda que históricamente ofreció oportunidades de sobrepaso.', x: 152, y: 295 },
    ],
  },
]

export const officialCircuits = circuits.filter((circuit) => circuit.category === 'official').sort((first, second) => (first.round ?? 0) - (second.round ?? 0))
export const specialCircuits = circuits.filter((circuit) => circuit.category === 'special')

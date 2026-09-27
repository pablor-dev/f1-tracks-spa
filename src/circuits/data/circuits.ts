import type { Circuit, CircuitCategory, CircuitStatus, HotspotType, TrackHotspot } from '../model/circuit'
import { finishLineProgressByCircuitId, hasCurveReference, hotspotProgressByCircuitId } from './trackPresentation'

type HotspotSeed = readonly [label: string, title: string, type: HotspotType, description: string]

interface CircuitSeed {
  id: string
  name: string
  officialName: string
  city: string
  country: string
  countryCode: string
  image: string
  category?: CircuitCategory
  status?: CircuitStatus
  round?: number
  summary: string
  history: string
  challenges: string[]
  hotspots: HotspotSeed[]
  backgroundPosition?: string
}

const trackMapByCircuitId: Readonly<Record<string, string>> = {
  'albert-park': 'melbourne-2.svg',
  shanghai: 'shanghai-1.svg',
  suzuka: 'suzuka-2.svg',
  miami: 'miami-1.svg',
  montreal: 'montreal-6.svg',
  monaco: 'monaco-6.svg',
  barcelona: 'catalunya-6.svg',
  'red-bull-ring': 'spielberg-3.svg',
  silverstone: 'silverstone-8.svg',
  spa: 'spa-francorchamps-4.svg',
  hungaroring: 'hungaroring-3.svg',
  zandvoort: 'zandvoort-5.svg',
  monza: 'monza-7.svg',
  madring: 'madring-1.svg',
  baku: 'baku-1.svg',
  sepang: 'sepang-1.svg',
  singapore: 'marina-bay-4.svg',
  austin: 'austin-1.svg',
  mexico: 'mexico-city-3.svg',
  interlagos: 'interlagos-2.svg',
  'las-vegas': 'las-vegas-1.svg',
  lusail: 'lusail-1.svg',
  'yas-marina': 'yas-marina-2.svg',
  galvez: 'buenos-aires-3.svg',
  bahrain: 'bahrain-1.svg',
  jeddah: 'jeddah-1.svg',
  imola: 'imola-3.svg',
}

function buildHotspots(id: string, seeds: HotspotSeed[]): TrackHotspot[] {
  const progressValues = hotspotProgressByCircuitId[id]
  return seeds.map(([label, title, type, description], index) => ({
    id: `${id}-${index + 1}`,
    label,
    title,
    type,
    sector: Math.min(3, Math.floor(index * 3 / seeds.length) + 1),
    progress: progressValues?.[index],
    description,
  }))
}

const seeds: CircuitSeed[] = [
  { id: 'albert-park', name: 'Albert Park', officialName: 'Albert Park Grand Prix Circuit', city: 'Melbourne', country: 'Australia', countryCode: 'AU', image: 'melbourne.webp', round: 1, summary: 'Un trazado semipermanente rápido que recorre el entorno de Albert Park.', history: 'Melbourne recibe a la Fórmula 1 en Albert Park desde 1996 y el trazado ha evolucionado para ganar fluidez.', challenges: ['Confianza en curvas rápidas', 'Frenadas sobre asfalto urbano', 'Gestión del neumático delantero'], hotspots: [['T1', 'Jones', 'braking-zone', 'La primera frenada combina alta velocidad y poco margen al inicio de la vuelta.'], ['T9–10', 'Cambio rápido', 'high-speed', 'Una secuencia veloz que exige estabilidad y compromiso.'], ['T11', 'Frenada técnica', 'technical', 'La entrada premia un auto equilibrado y una trazada precisa.']] },
  { id: 'shanghai', name: 'Shanghai', officialName: 'Shanghai International Circuit', city: 'Shanghai', country: 'China', countryCode: 'CN', image: 'shanghai.webp', round: 2, summary: 'Curvas prolongadas y una extensa recta plantean un compromiso completo de puesta a punto.', history: 'Inaugurado en 2004, su diseño combina secciones técnicas con una de las rectas más largas del calendario.', challenges: ['Desgaste delantero', 'Tracción a baja velocidad', 'Equilibrio entre recta y curva'], hotspots: [['T1–2', 'Caracol inicial', 'technical', 'La curva se cierra progresivamente y castiga el neumático delantero.'], ['T7–8', 'Ese rápida', 'high-speed', 'El cambio de apoyo exige precisión y carga estable.'], ['T14', 'Horquilla', 'overtaking', 'Una frenada intensa al final de la recta crea una oportunidad clara de adelantamiento.']] },
  { id: 'suzuka', name: 'Suzuka', officialName: 'Suzuka International Racing Course', city: 'Suzuka', country: 'Japón', countryCode: 'JP', image: 'suzuka.webp', round: 3, summary: 'Un trazado en forma de ocho, rápido y estrecho, definido por su ritmo continuo.', history: 'Nació como pista de pruebas de Honda en 1962 y se convirtió en una referencia técnica de la Fórmula 1.', challenges: ['Ritmo en curvas enlazadas', 'Carga lateral', 'Escaso margen de error'], hotspots: [['T3–7', 'Esses', 'technical', 'Cada vértice prepara el siguiente y un error afecta toda la secuencia.'], ['T8–9', 'Degner Curves', 'corner', 'Dos curvas rápidas con poco margen en la salida.'], ['T11', 'Hairpin', 'braking-zone', 'La horquilla exige desaceleración, rotación y buena tracción.'], ['T13–14', 'Spoon Curve', 'technical', 'La larga doble curva condiciona la velocidad hacia la recta.'], ['T15', '130R', 'high-speed', 'Una curva de altísima velocidad que expone el balance aerodinámico.'], ['T16–17', 'Casio Triangle', 'chicane', 'La última chicana concentra frenada y precisión.']] },
  { id: 'miami', name: 'Miami', officialName: 'Miami International Autodrome', city: 'Miami', country: 'Estados Unidos', countryCode: 'US', image: 'miami.webp', round: 4, summary: 'Un circuito urbano temporal con largas rectas y un sector lento muy técnico.', history: 'El trazado alrededor del Hard Rock Stadium se incorporó al campeonato en 2022.', challenges: ['Tracción lenta', 'Frenadas fuertes', 'Temperatura de pista'], hotspots: [['T1', 'Primera curva', 'braking-zone', 'Una frenada de alta presión abre la vuelta.'], ['T11–16', 'Sector técnico', 'technical', 'La sección más lenta requiere paciencia y precisión.'], ['T17', 'Final de recta', 'overtaking', 'La frenada favorece intentos de adelantamiento.']] },
  { id: 'montreal', name: 'Montreal', officialName: 'Circuit Gilles Villeneuve', city: 'Montreal', country: 'Canadá', countryCode: 'CA', image: 'montreal.webp', round: 5, summary: 'Rectas, chicanas y muros cercanos definen la pista de la Île Notre-Dame.', history: 'El circuito lleva el nombre de Gilles Villeneuve y alberga el Gran Premio de Canadá desde 1978.', challenges: ['Estabilidad en frenada', 'Ataque de pianos', 'Tracción'], hotspots: [['T1–2', 'Senna S', 'technical', 'La apertura enlazada exige una salida limpia.'], ['T10', 'Horquilla', 'overtaking', 'La frenada y la tracción condicionan la recta siguiente.'], ['T13–14', 'Muro de los Campeones', 'chicane', 'La última chicana deja muy poco margen junto al muro.']] },
  { id: 'monaco', name: 'Monaco', officialName: 'Circuit de Monaco', city: 'Monte Carlo', country: 'Mónaco', countryCode: 'MC', image: 'monaco.webp', round: 6, summary: 'Calles estrechas, baja velocidad media y precisión absoluta en un entorno histórico.', history: 'El trazado urbano de Monte Carlo es una de las pruebas más antiguas y reconocibles del campeonato.', challenges: ['Precisión milimétrica', 'Tracción lenta', 'Sin margen de error'], hotspots: [['T1', 'Sainte Dévote', 'braking-zone', 'La primera curva estrecha concentra presión y tráfico.'], ['T6', 'Grand Hotel Hairpin', 'corner', 'La horquilla más lenta requiere máximo ángulo de dirección.'], ['T10–11', 'Nouvelle Chicane', 'chicane', 'La frenada tras el túnel es uno de los pocos puntos de ataque.']] },
  { id: 'barcelona', name: 'Barcelona-Catalunya', officialName: 'Circuit de Barcelona-Catalunya', city: 'Montmeló', country: 'España', countryCode: 'ES', image: 'barcelona-catalunya.webp', round: 7, summary: 'Un trazado equilibrado que combina curvas largas, apoyo aerodinámico y frenadas intensas.', history: 'Montmeló forma parte de la Fórmula 1 desde 1991 y ha sido una pista habitual de evaluación técnica.', challenges: ['Carga aerodinámica', 'Desgaste lateral', 'Balance general'], hotspots: [['T1', 'Elf', 'overtaking', 'La larga frenada de final de recta favorece adelantamientos.'], ['T3', 'Renault', 'high-speed', 'Una curva larga que exige apoyo constante.'], ['T10', 'La Caixa', 'braking-zone', 'El cambio de ritmo pone a prueba frenada y rotación.']] },
  { id: 'red-bull-ring', name: 'Red Bull Ring', officialName: 'Red Bull Ring', city: 'Spielberg', country: 'Austria', countryCode: 'AT', image: 'austria.webp', round: 8, summary: 'Una vuelta corta con grandes desniveles, rectas y frenadas claras.', history: 'El circuito de Spielberg ha competido bajo distintas configuraciones y nombres desde finales de los años sesenta.', challenges: ['Frenada cuesta arriba', 'Tracción', 'Límites de pista'], hotspots: [['T1', 'Niki Lauda', 'braking-zone', 'La salida en subida determina la aceleración posterior.'], ['T3', 'Remus', 'overtaking', 'La horquilla es un punto principal de adelantamiento.'], ['T9–10', 'Descenso final', 'high-speed', 'Dos curvas rápidas completan una vuelta muy compacta.']] },
  { id: 'silverstone', name: 'Silverstone', officialName: 'Silverstone Circuit', city: 'Silverstone', country: 'Reino Unido', countryCode: 'GB', image: 'silverstone.webp', round: 9, summary: 'Curvas de alta velocidad y cambios de apoyo hacen de Silverstone una prueba aerodinámica.', history: 'Construido sobre un antiguo aeródromo, fue sede de la primera carrera del Mundial en 1950.', challenges: ['Alta carga lateral', 'Viento', 'Ritmo en secuencias'], hotspots: [['T6–7', 'Luffield', 'technical', 'La larga curva exige paciencia antes de acelerar.'], ['T10–14', 'Maggotts y Becketts', 'high-speed', 'Una secuencia emblemática de cambios de apoyo.'], ['T15', 'Stowe', 'braking-zone', 'La frenada llega tras una recta de alta velocidad.']] },
  { id: 'spa', name: 'Spa-Francorchamps', officialName: 'Circuit de Spa-Francorchamps', city: 'Stavelot', country: 'Bélgica', countryCode: 'BE', image: 'spa-francorchamps.webp', round: 10, summary: 'Un circuito extenso y veloz, marcado por el desnivel y un clima cambiante.', history: 'Spa conserva el carácter de las rutas de las Ardenas y es una de las sedes históricas del campeonato.', challenges: ['Desnivel', 'Clima variable', 'Compromiso aerodinámico'], hotspots: [['T1', 'La Source', 'overtaking', 'La horquilla inicial reúne frenada, tráfico y tracción.'], ['T3', 'Eau Rouge', 'elevation', 'La compresión inicia un cambio de elevación muy marcado.'], ['T4', 'Raidillon', 'high-speed', 'La subida ciega exige confianza y precisión.'], ['T5–7', 'Les Combes', 'braking-zone', 'La frenada corona la larga aceleración desde Eau Rouge.'], ['T10–11', 'Pouhon', 'high-speed', 'La doble izquierda somete al auto a alta carga lateral.'], ['T17', 'Blanchimont', 'high-speed', 'Una sección de gran velocidad antes de la última chicana.']] },
  { id: 'hungaroring', name: 'Hungaroring', officialName: 'Hungaroring', city: 'Mogyoród', country: 'Hungría', countryCode: 'HU', image: 'hungaroring.webp', round: 11, summary: 'Un circuito revirado donde el ritmo y la carga aerodinámica pesan más que la velocidad punta.', history: 'Inaugurado en 1986, fue la primera sede de Fórmula 1 al este del Telón de Acero.', challenges: ['Curvas enlazadas', 'Calor', 'Pocas zonas de descanso'], hotspots: [['T1', 'Primera horquilla', 'overtaking', 'La frenada principal ofrece una oportunidad de adelantamiento.'], ['T4', 'Curva ciega', 'elevation', 'La entrada rápida y ciega exige decisión.'], ['T6–7', 'Chicana', 'chicane', 'El cambio de dirección rompe el ritmo del sector medio.']] },
  { id: 'zandvoort', name: 'Zandvoort', officialName: 'Circuit Zandvoort', city: 'Zandvoort', country: 'Países Bajos', countryCode: 'NL', image: 'zandvoort.webp', round: 12, summary: 'Dunas, desnivel y curvas peraltadas dan al trazado neerlandés una identidad singular.', history: 'Zandvoort regresó al calendario en 2021 tras una amplia modernización que conservó su carácter.', challenges: ['Peraltes', 'Trazado estrecho', 'Carga lateral'], hotspots: [['T1', 'Tarzan', 'overtaking', 'La horquilla amplia permite distintas líneas.'], ['T7', 'Scheivlak', 'high-speed', 'Una curva rápida en descenso exige confianza.'], ['T14', 'Arie Luyendyk', 'corner', 'El peralte permite acelerar hacia la recta principal.']] },
  { id: 'monza', name: 'Monza', officialName: 'Autodromo Nazionale Monza', city: 'Monza', country: 'Italia', countryCode: 'IT', image: 'monza.webp', round: 13, summary: 'El Templo de la Velocidad combina largas rectas con frenadas de máxima exigencia.', history: 'Inaugurado en 1922, Monza es uno de los escenarios más antiguos y permanentes de la Fórmula 1.', challenges: ['Baja carga aerodinámica', 'Frenadas extremas', 'Tracción en chicanas'], hotspots: [['T1–2', 'Variante del Rettifilo', 'chicane', 'La mayor frenada de la vuelta exige precisión entre tráfico.'], ['T3', 'Curva Grande', 'high-speed', 'Una derecha prolongada recorrida a gran velocidad.'], ['T4–5', 'Variante della Roggia', 'chicane', 'El ataque a los pianos condiciona la salida.'], ['T6–7', 'Lesmo', 'corner', 'Dos derechas donde la tracción es determinante.'], ['T8–10', 'Variante Ascari', 'technical', 'Una secuencia rápida que premia el ritmo.'], ['T11', 'Curva Alboreto', 'historic', 'La curva final es clave para defender o atacar en la recta.']] },
  { id: 'madring', name: 'Madring', officialName: 'Madring', city: 'Madrid', country: 'España', countryCode: 'ES', image: 'madring.webp', round: 14, summary: 'Un nuevo trazado urbano y semipermanente integrado en el entorno de Madrid.', history: 'Madrid se incorpora al calendario 2026 con un circuito de nueva construcción.', challenges: ['Aprendizaje de pista', 'Cambios de ritmo', 'Superficie urbana'], hotspots: [['T3', 'Curva 3', 'technical', 'Una referencia temprana dentro de la primera secuencia del trazado.'], ['T10', 'Curva 10', 'high-speed', 'El cambio de ritmo del tramo medio exige una trayectoria precisa.'], ['T18', 'Curva 18', 'braking-zone', 'Una referencia de la fase final antes de completar la vuelta.']] },
  { id: 'baku', name: 'Baku', officialName: 'Baku City Circuit', city: 'Baku', country: 'Azerbaiyán', countryCode: 'AZ', image: 'baku.webp', round: 15, summary: 'Un urbano de contrastes: sección medieval estrecha y una larguísima recta principal.', history: 'Baku forma parte del campeonato desde 2016 y combina velocidad punta con precisión entre muros.', challenges: ['Baja carga', 'Muros cercanos', 'Frenadas fuertes'], hotspots: [['T1', 'Primera frenada', 'overtaking', 'La recta principal desemboca en una frenada de ataque.'], ['T8', 'Castillo', 'historic', 'La sección más estrecha requiere exactitud absoluta.'], ['T16–20', 'Aceleración final', 'high-speed', 'Una larga secuencia a fondo prioriza eficiencia.']] },
  { id: 'sepang', name: 'Sepang', officialName: 'Sepang International Circuit', city: 'Sepang', country: 'Malasia', countryCode: 'MY', image: 'sepang.webp', round: 16, summary: 'Curvas amplias, largas rectas y calor tropical forman una prueba física y técnica.', history: 'Sepang fue inaugurado en 1999 y abrió una etapa de circuitos modernos en Asia.', challenges: ['Calor y humedad', 'Curvas largas', 'Compromiso aerodinámico'], hotspots: [['T1–2', 'Complejo inicial', 'technical', 'Dos curvas de radios distintos exigen rotación y tracción.'], ['T5–6', 'Ese rápida', 'high-speed', 'El cambio de apoyo carga los neumáticos.'], ['T15', 'Horquilla final', 'overtaking', 'La frenada final ofrece líneas alternativas.']] },
  { id: 'singapore', name: 'Marina Bay', officialName: 'Marina Bay Street Circuit', city: 'Singapur', country: 'Singapur', countryCode: 'SG', image: 'marina-bay.webp', round: 17, summary: 'Una carrera nocturna entre muros, calor y numerosas frenadas.', history: 'Marina Bay acogió en 2008 la primera carrera nocturna de la Fórmula 1.', challenges: ['Calor', 'Concentración', 'Tracción urbana'], hotspots: [['T1–3', 'Complejo inicial', 'technical', 'El inicio enlazado exige colocación precisa.'], ['T5', 'Aceleración urbana', 'high-speed', 'La salida limpia abre una sección rápida.'], ['T14', 'Frenada de ataque', 'overtaking', 'Una frenada marcada crea opciones de adelantamiento.']] },
  { id: 'austin', name: 'Austin', officialName: 'Circuit of The Americas', city: 'Austin', country: 'Estados Unidos', countryCode: 'US', image: 'austin.webp', round: 18, summary: 'Desnivel, curvas inspiradas en trazados clásicos y una gran horquilla definen COTA.', history: 'Inaugurado en 2012, fue el primer circuito estadounidense construido específicamente para la Fórmula 1.', challenges: ['Desnivel', 'Cambios de apoyo', 'Gestión de neumáticos'], hotspots: [['T1', 'Subida inicial', 'elevation', 'La fuerte pendiente amplía las posibilidades de trazada.'], ['T3–6', 'Eses', 'high-speed', 'El ritmo enlazado requiere una plataforma estable.'], ['T12', 'Frenada de recta', 'overtaking', 'La larga recta termina en el principal punto de ataque.']] },
  { id: 'mexico', name: 'México', officialName: 'Autódromo Hermanos Rodríguez', city: 'Ciudad de México', country: 'México', countryCode: 'MX', image: 'mexico.webp', round: 19, summary: 'La altitud condiciona aerodinámica, refrigeración y potencia en un circuito de largas rectas.', history: 'El autódromo recibió a la Fórmula 1 en distintas etapas y hoy atraviesa el emblemático Foro Sol.', challenges: ['Gran altitud', 'Refrigeración', 'Baja densidad del aire'], hotspots: [['T1', 'Primera chicana', 'braking-zone', 'La frenada desde alta velocidad concentra adelantamientos.'], ['T7–11', 'Eses rápidas', 'high-speed', 'Una secuencia de apoyo continuo prueba la aerodinámica.'], ['T12–16', 'Foro Sol', 'historic', 'El sector del estadio aporta baja velocidad y una atmósfera singular.']] },
  { id: 'interlagos', name: 'Interlagos', officialName: 'Autódromo José Carlos Pace / Interlagos', city: 'São Paulo', country: 'Brasil', countryCode: 'BR', image: 'sao-paulo.webp', round: 20, summary: 'Una vuelta corta, ondulada y en sentido antihorario que suele producir carreras intensas.', history: 'Interlagos es una sede histórica brasileña y su configuración actual conserva importantes desniveles.', challenges: ['Desnivel', 'Tracción', 'Clima cambiante'], hotspots: [['T1–2', 'Senna S', 'overtaking', 'El descenso inicial ofrece más de una línea.'], ['T6–7', 'Laranjinha', 'high-speed', 'La doble derecha mantiene una elevada carga lateral.'], ['T12', 'Junção', 'technical', 'La salida determina toda la subida hacia meta.']] },
  { id: 'las-vegas', name: 'Las Vegas', officialName: 'Las Vegas Strip Circuit', city: 'Las Vegas', country: 'Estados Unidos', countryCode: 'US', image: 'las-vegas.webp', round: 21, summary: 'Un circuito nocturno de baja carga con largas rectas por el centro de Las Vegas.', history: 'El actual trazado urbano debutó en 2023 y recorre parte del Strip.', challenges: ['Bajas temperaturas', 'Calentamiento de neumáticos', 'Velocidad punta'], hotspots: [['T1', 'Primera curva', 'braking-zone', 'La frenada inicial llega con neumáticos difíciles de mantener en temperatura.'], ['T12', 'Entrada al Strip', 'technical', 'La salida correcta abre la aceleración más larga.'], ['T14', 'Frenada del Strip', 'overtaking', 'La gran desaceleración ofrece una oportunidad de ataque.']] },
  { id: 'lusail', name: 'Lusail', officialName: 'Lusail International Circuit', city: 'Lusail', country: 'Catar', countryCode: 'QA', image: 'lusail.webp', round: 22, summary: 'Curvas medias y rápidas dominan un trazado fluido bajo iluminación artificial.', history: 'Lusail se construyó para motociclismo y recibió por primera vez a la Fórmula 1 en 2021.', challenges: ['Carga lateral', 'Calor', 'Curvas rápidas'], hotspots: [['T1', 'Primera curva', 'overtaking', 'La principal frenada sigue a la recta de meta.'], ['T4–5', 'Doble derecha', 'technical', 'El apoyo sostenido exige precisión.'], ['T12–14', 'Triple derecha', 'high-speed', 'La secuencia rápida acumula carga lateral.']] },
  { id: 'yas-marina', name: 'Yas Marina', officialName: 'Yas Marina Circuit', city: 'Abu Dhabi', country: 'Emiratos Árabes Unidos', countryCode: 'AE', image: 'yas-marina.webp', round: 23, summary: 'Una carrera del atardecer a la noche con rectas largas y un sector final técnico.', history: 'Yas Marina forma parte del calendario desde 2009 y fue revisado en 2021 para mejorar la fluidez.', challenges: ['Tracción', 'Transición térmica', 'Frenadas intensas'], hotspots: [['T1', 'Primera curva', 'corner', 'La izquierda rápida abre la vuelta.'], ['T6', 'Horquilla', 'technical', 'Una buena salida es clave antes de la recta.'], ['T9', 'Curva larga', 'high-speed', 'La curva prolongada pone a prueba la estabilidad.']] },
  { id: 'bahrain', name: 'Bahréin', officialName: 'Bahrain International Circuit', city: 'Sakhir', country: 'Baréin', countryCode: 'BH', image: 'bahrain.webp', category: 'special', status: 'special', summary: 'Un circuito desértico con fuertes frenadas, rectas y salidas de baja velocidad.', history: 'Sakhir acogió en 2004 el primer Gran Premio de Fórmula 1 en Oriente Medio.', challenges: ['Tracción', 'Frenada', 'Viento y arena'], hotspots: [['T1', 'Primera curva', 'overtaking', 'La frenada principal permite distintas líneas.'], ['T9–10', 'Doble izquierda', 'braking-zone', 'Frenar mientras el auto gira compromete el bloqueo delantero.'], ['T12', 'Curva rápida', 'high-speed', 'El apoyo en subida exige confianza.']] },
  { id: 'jeddah', name: 'Jeddah', officialName: 'Jeddah Corniche Circuit', city: 'Jeddah', country: 'Arabia Saudita', countryCode: 'SA', image: 'jeddah.webp', category: 'special', status: 'special', summary: 'Un urbano nocturno extremadamente veloz junto al mar Rojo.', history: 'Jeddah debutó en 2021 con un diseño de curvas rápidas y muros cercanos.', challenges: ['Alta velocidad', 'Visibilidad', 'Muros cercanos'], hotspots: [['T1', 'Primera chicana', 'braking-zone', 'La frenada abre una secuencia lenta.'], ['T13', 'Curva peraltada', 'corner', 'La amplia izquierda cambia el ritmo de la vuelta.'], ['T22–24', 'Sección rápida', 'high-speed', 'Los cambios de dirección requieren decisión.']] },
  { id: 'imola', name: 'Imola', officialName: 'Autodromo Enzo e Dino Ferrari', city: 'Imola', country: 'Italia', countryCode: 'IT', image: 'imola.webp', category: 'special', status: 'historic', summary: 'Un circuito clásico, estrecho y en sentido antihorario, con desnivel y pianos agresivos.', history: 'Imola fue sede de Grandes Premios en distintas etapas y mantiene una fuerte identidad histórica.', challenges: ['Pianos', 'Trazado estrecho', 'Cambios de elevación'], hotspots: [['T2–4', 'Tamburello', 'chicane', 'La chicana inicial combina frenada y cambios de dirección.'], ['T11–12', 'Acque Minerali', 'elevation', 'El desnivel y la compresión exigen control.'], ['T17–18', 'Rivazza', 'braking-zone', 'Dos izquierdas en descenso condicionan la recta principal.']] },
  { id: 'galvez', name: 'Oscar y Juan Gálvez', officialName: 'Autódromo Oscar y Juan Gálvez', city: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', image: 'buenos-aires.webp', category: 'special', status: 'historic', summary: 'Un emblema del automovilismo argentino con múltiples configuraciones.', history: 'Inaugurado en 1952, fue escenario del Gran Premio de Argentina en distintas etapas entre 1953 y 1998.', challenges: ['Adaptación a variantes', 'Frenada y tracción', 'Superficie cambiante'], hotspots: [['Curvón', 'Curvón Salotto', 'historic', 'Una referencia del trazado extenso por su velocidad y compromiso.'], ['Mixtos', 'Sector mixto', 'technical', 'Los cambios de dirección exigen agilidad.'], ['Horquilla', 'Horquilla', 'overtaking', 'Una frenada profunda históricamente asociada a intentos de sobrepaso.']] },
]

export const circuits: Circuit[] = seeds.map((seed) => {
  const category = seed.category ?? 'official'
  const trackMap = trackMapByCircuitId[seed.id]
  return {
    id: seed.id,
    slug: seed.id,
    name: seed.name,
    officialName: seed.officialName,
    city: seed.city,
    country: seed.country,
    countryCode: seed.countryCode,
    category,
    status: seed.status ?? 'current',
    season: category === 'official' ? 2026 : undefined,
    round: seed.round,
    summary: seed.summary,
    history: seed.history,
    challenges: seed.challenges,
    theme: {
      backgroundImage: `/circuits/${seed.image}`,
      backgroundAlt: `Vista ambiental de ${seed.officialName}, ${seed.city}`,
      backgroundPosition: seed.backgroundPosition ?? 'center',
      visualTreatment: 'cinematic-dark',
    },
    track: {
      finishLineProgress: finishLineProgressByCircuitId[seed.id],
      mapImage: trackMap ? `/circuits/tracks/${trackMap}` : null,
      hotspots: buildHotspots(seed.id, seed.hotspots),
      representation: trackMap ? 'verified' : 'unavailable',
      referenceCoverage: hasCurveReference(seed.id) ? 'curve-reference' : 'track-only',
    },
  }
})

export const officialCircuits = circuits.filter((circuit) => circuit.category === 'official').sort((first, second) => (first.round ?? 0) - (second.round ?? 0))
export const specialCircuits = circuits.filter((circuit) => circuit.category === 'special')

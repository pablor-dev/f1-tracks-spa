import { Badge } from '../../../shared/ui/atoms/Badge'
import type { Circuit } from '../../model/circuit'

interface CircuitHeroProps { circuit: Circuit }

export function CircuitHero({ circuit }: CircuitHeroProps) {
  const isOfficial = circuit.category === 'official'
  return (
    <section aria-labelledby="circuit-title" className="relative min-w-0">
      <div className="relative min-w-0 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isOfficial ? 'official' : 'special'}>{isOfficial ? `Temporada ${circuit.season}` : 'Archivo histórico'}</Badge>
          {isOfficial ? <Badge tone="brand">Ronda {circuit.round}</Badge> : <Badge>{circuit.status === 'historic' ? 'Histórico' : 'Especial'} · Fuera del calendario 2026</Badge>}
        </div>
        <p className="mt-4 text-sm font-bold tracking-label text-content-muted uppercase">{circuit.city} · {circuit.country}</p>
        <h1 className="circuit-title mt-2 font-black tracking-display text-content" id="circuit-title">{circuit.name}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-content-soft">{circuit.summary}</p>
      </div>
    </section>
  )
}

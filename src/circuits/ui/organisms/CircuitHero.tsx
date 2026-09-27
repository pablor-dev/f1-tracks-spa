import { Badge } from '../../../shared/ui/atoms/Badge'
import type { Circuit } from '../../model/circuit'

interface CircuitHeroProps { circuit: Circuit }

export function CircuitHero({ circuit }: CircuitHeroProps) {
  const isOfficial = circuit.category === 'official'
  return (
    <section aria-labelledby="circuit-title" className="relative">
      <div className="relative max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isOfficial ? 'official' : 'special'}>{isOfficial ? `Temporada ${circuit.season}` : 'Archivo histórico'}</Badge>
          {isOfficial ? <Badge tone="brand">Ronda {circuit.round}</Badge> : <Badge>{circuit.status === 'historic' ? 'Histórico' : 'Especial'} · Fuera del calendario 2026</Badge>}
        </div>
        <p className="mt-6 text-sm font-bold tracking-label text-content-muted uppercase">{circuit.city} · {circuit.country}</p>
        <h1 className="mt-2 text-display font-black tracking-display text-balance text-content" id="circuit-title">{circuit.name}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-content-soft sm:text-lg">{circuit.summary}</p>
        <p className="mt-5 font-mono text-xs font-bold tracking-label text-brand-bright uppercase">{circuit.officialName}</p>
      </div>
    </section>
  )
}

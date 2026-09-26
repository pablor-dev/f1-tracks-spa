import { Badge } from '../../../shared/ui/atoms/Badge'
import type { Circuit } from '../../model/circuit'

interface CircuitHeroProps { circuit: Circuit }

export function CircuitHero({ circuit }: CircuitHeroProps) {
  const isOfficial = circuit.category === 'official'
  return (
    <section className="relative pt-10 sm:pt-16 lg:pt-20" id="inicio">
      <div className="hero-glow" aria-hidden="true" />
      <div className="relative max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={isOfficial ? 'official' : 'special'}>{isOfficial ? `Temporada ${circuit.season}` : 'Archivo histórico'}</Badge>
          {isOfficial ? <Badge tone="brand">Ronda {circuit.round}</Badge> : <Badge>No integra el calendario 2026</Badge>}
        </div>
        <p className="mt-6 text-sm font-bold tracking-label text-content-muted uppercase">{circuit.city} · {circuit.country}</p>
        <h1 className="mt-2 text-display font-black tracking-display text-balance text-content">{circuit.name}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-content-soft sm:text-lg">{circuit.summary}</p>
        <p className="mt-5 font-mono text-xs font-bold tracking-label text-brand-bright uppercase">{circuit.character}</p>
      </div>
    </section>
  )
}

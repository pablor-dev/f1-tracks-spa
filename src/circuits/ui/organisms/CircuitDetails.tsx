import { SectionHeading } from '../../../shared/ui/molecules/SectionHeading'
import type { Circuit } from '../../model/circuit'

interface CircuitDetailsProps { circuit: Circuit }

export function CircuitDetails({ circuit }: CircuitDetailsProps) {
  return (
    <section className="pb-section" id="historia" aria-labelledby="historia-title">
      <SectionHeading eyebrow="Contexto y exigencia" title="Lo que define a este circuito" />
      <div className="mt-8 grid gap-4 lg:grid-cols-details">
        <article className="rounded-panel border border-line-subtle bg-surface p-6 shadow-panel sm:p-8">
          <p className="eyebrow">Historia</p>
          <h3 className="mt-3 text-xl font-black" id="historia-title">Una identidad construida vuelta a vuelta</h3>
          <p className="mt-4 leading-relaxed text-content-muted">{circuit.history}</p>
        </article>
        <article className="rounded-panel border border-line-subtle bg-surface p-6 shadow-panel sm:p-8">
          <p className="eyebrow">Desafíos</p>
          <h3 className="mt-3 text-xl font-black">Dónde se gana tiempo</h3>
          <dl className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {circuit.challenges.map((challenge) => (
              <div className="rounded-control border border-line-subtle bg-surface-raised p-4" key={challenge.label}>
                <dt className="text-xs font-bold tracking-label text-content-dim uppercase">{challenge.label}</dt>
                <dd className="mt-1 font-bold text-content">{challenge.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  )
}

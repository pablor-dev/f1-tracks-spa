import type { Circuit } from '../../model/circuit'

interface CircuitDetailsProps { circuit: Circuit }

export function CircuitDetails({ circuit }: CircuitDetailsProps) {
  return (
    <section className="mt-5 min-w-0" id="historia" aria-labelledby="historia-title">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <article className="min-w-0 rounded-panel border border-white/15 bg-surface/80 p-4 shadow-panel backdrop-blur-md sm:p-5">
          <p className="eyebrow">Historia</p>
          <h2 className="mt-2 text-base font-black" id="historia-title">Una identidad construida vuelta a vuelta</h2>
          <p className="mt-2 text-sm leading-relaxed text-content-muted">{circuit.history}</p>
        </article>
        <article className="min-w-0 rounded-panel border border-white/15 bg-surface/80 p-4 shadow-panel backdrop-blur-md sm:p-5">
          <p className="eyebrow">Desafíos</p>
          <h2 className="mt-2 text-base font-black">Dónde se gana tiempo</h2>
          <ul className="mt-3 grid gap-1.5">
            {circuit.challenges.map((challenge) => (
              <li className="flex items-start gap-3 text-sm font-semibold text-content-soft" key={challenge}>
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {challenge}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

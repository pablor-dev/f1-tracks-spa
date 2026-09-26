import { useState } from 'react'
import { Badge } from '../../../shared/ui/atoms/Badge'
import { SectionHeading } from '../../../shared/ui/molecules/SectionHeading'
import type { Circuit, CircuitHighlight } from '../../model/circuit'

interface TrackExplorerProps { circuit: Circuit }

export function TrackExplorer({ circuit }: TrackExplorerProps) {
  const [selectedHighlight, setSelectedHighlight] = useState(circuit.highlights[0] ?? null)
  const selectHighlight = (highlight: CircuitHighlight) => setSelectedHighlight(highlight)

  return (
    <section aria-labelledby="trazado-title" className="py-section">
      <SectionHeading eyebrow="Mapa interactivo" headingId="trazado-title" title="Leé la pista antes de la primera curva" description="Seleccioná los puntos del trazado para descubrir dónde se concentra el desafío." />
      <div className="mt-8 grid overflow-hidden rounded-panel border border-line-subtle bg-surface shadow-panel lg:grid-cols-track">
        <div className="track-grid relative min-h-track overflow-hidden p-4 sm:p-8">
          <svg aria-label={`Representación interactiva del trazado de ${circuit.officialName}`} className="relative z-content h-full min-h-track w-full overflow-visible" role="img" viewBox={circuit.trackViewBox}>
            <path className="track-shadow" d={circuit.trackPath} fill="none" pathLength="1" />
            <path className="track-line" d={circuit.trackPath} fill="none" pathLength="1" />
            {circuit.highlights.map((highlight, index) => {
              const isSelected = highlight.id === selectedHighlight?.id
              return (
                <g
                  aria-label={`${highlight.label}: ${highlight.name}`}
                  aria-pressed={isSelected}
                  className="track-marker focus-ring"
                  key={highlight.id}
                  onClick={() => selectHighlight(highlight)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      selectHighlight(highlight)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  transform={`translate(${highlight.x} ${highlight.y})`}
                >
                  <circle className={isSelected ? 'is-selected' : ''} r="22" />
                  <text textAnchor="middle" y="4">{index + 1}</text>
                </g>
              )
            })}
          </svg>
          <span className="absolute right-4 bottom-4 font-mono text-xs tracking-label text-content-dim uppercase">Vista superior · Esquema visual</span>
        </div>
        <div className="border-t border-line-subtle p-5 sm:p-8 lg:border-t-0 lg:border-l">
          <p className="eyebrow">Puntos destacados</p>
          <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
            {circuit.highlights.map((highlight) => {
              const isSelected = highlight.id === selectedHighlight?.id
              return (
                <button
                  aria-pressed={isSelected}
                  className={`focus-ring rounded-control border px-3 py-2 text-left text-sm font-bold transition-ui ${isSelected ? 'border-brand bg-brand-soft text-brand-bright' : 'border-line-subtle bg-surface-raised text-content-muted hover:border-line-strong hover:text-content'}`}
                  key={highlight.id}
                  onClick={() => selectHighlight(highlight)}
                  type="button"
                >
                  {highlight.label}
                </button>
              )
            })}
          </div>
          {selectedHighlight ? (
            <div className="mt-8" aria-live="polite">
              <Badge>{selectedHighlight.sector}</Badge>
              <h3 className="mt-3 text-xl font-black">{selectedHighlight.name}</h3>
              <p className="mt-3 leading-relaxed text-content-muted">{selectedHighlight.description}</p>
            </div>
          ) : <p className="mt-8 text-content-muted">No hay puntos destacados.</p>}
        </div>
      </div>
    </section>
  )
}

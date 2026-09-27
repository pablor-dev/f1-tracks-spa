import { useState } from 'react'
import { Badge } from '../../../shared/ui/atoms/Badge'
import type { Circuit, TrackHotspot } from '../../model/circuit'

interface TrackExplorerProps { circuit: Circuit }

export function TrackExplorer({ circuit }: TrackExplorerProps) {
  const [selectedHotspot, setSelectedHotspot] = useState(circuit.track.hotspots[0] ?? null)
  const selectHotspot = (hotspot: TrackHotspot) => setSelectedHotspot(hotspot)

  return (
    <section aria-labelledby="trazado-title" className="overflow-hidden rounded-panel border border-white/15 bg-surface/90 shadow-panel backdrop-blur-md">
      <div className="border-b border-line-subtle p-5 sm:p-6">
        <p className="eyebrow">Mapa interactivo</p>
        <h2 className="mt-2 text-xl font-black sm:text-2xl" id="trazado-title">Leé la pista antes de la primera curva</h2>
        <p className="mt-2 text-sm text-content-muted">Elegí un punto para descubrir dónde se concentra el desafío.</p>
      </div>
      <div className="track-grid relative min-h-track overflow-hidden p-4 sm:p-7">
          <svg aria-label={`Representación esquemática interactiva del trazado de ${circuit.officialName}`} className="relative z-content h-full min-h-track w-full overflow-visible" role="img" viewBox={circuit.track.viewBox}>
            <path className="track-shadow" d={circuit.track.svg} fill="none" pathLength="1" />
            <path className="track-line" d={circuit.track.svg} fill="none" pathLength="1" />
            {circuit.track.hotspots.map((hotspot, index) => {
              const isSelected = hotspot.id === selectedHotspot?.id
              return (
                <g
                  aria-label={`${hotspot.label}: ${hotspot.title}`}
                  aria-pressed={isSelected}
                  className="track-marker focus-ring"
                  key={hotspot.id}
                  onClick={() => selectHotspot(hotspot)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      selectHotspot(hotspot)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  transform={`translate(${hotspot.position.x} ${hotspot.position.y})`}
                >
                  <circle className={isSelected ? 'is-selected' : ''} r="22" />
                  <text textAnchor="middle" y="4">{index + 1}</text>
                </g>
              )
            })}
          </svg>
          <span className="absolute right-4 bottom-4 font-mono text-[0.65rem] tracking-label text-content-dim uppercase">Esquema provisional · no cartográfico</span>
      </div>
      <div className="border-t border-line-subtle p-5 sm:p-6">
          <p className="eyebrow">Puntos destacados</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {circuit.track.hotspots.map((hotspot) => {
              const isSelected = hotspot.id === selectedHotspot?.id
              return (
                <button
                  aria-pressed={isSelected}
                  className={`focus-ring rounded-control border px-3 py-2 text-left text-sm font-bold transition-ui ${isSelected ? 'border-brand bg-brand-soft text-brand-bright' : 'border-line-subtle bg-surface-raised text-content-muted hover:border-line-strong hover:text-content'}`}
                  key={hotspot.id}
                  onClick={() => selectHotspot(hotspot)}
                  type="button"
                >
                  {hotspot.label}
                </button>
              )
            })}
          </div>
          {selectedHotspot ? (
            <div className="mt-6" aria-atomic="true" aria-live="polite">
              <Badge>Sector {selectedHotspot.sector} · {selectedHotspot.type}</Badge>
              <h3 className="mt-3 text-xl font-black">{selectedHotspot.title}</h3>
              <p className="mt-3 leading-relaxed text-content-muted">{selectedHotspot.description}</p>
            </div>
          ) : <p className="mt-8 text-content-muted">No hay puntos destacados.</p>}
      </div>
    </section>
  )
}

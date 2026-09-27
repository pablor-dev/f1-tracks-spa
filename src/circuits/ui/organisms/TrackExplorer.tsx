import { useState } from 'react'
import type { Circuit } from '../../model/circuit'

interface TrackExplorerProps { circuit: Circuit }

export function TrackExplorer({ circuit }: TrackExplorerProps) {
  const [failedMap, setFailedMap] = useState<string | null>(null)
  const hasMap = circuit.track.mapImage !== null && failedMap !== circuit.track.mapImage

  return (
    <section aria-labelledby="trazado-title" className="min-w-0 overflow-hidden rounded-panel border border-white/15 bg-surface/90 shadow-panel backdrop-blur-md">
      <div className="border-b border-line-subtle p-4 sm:px-5 sm:py-4">
        <p className="eyebrow">Mapa interactivo</p>
        <h2 className="mt-1 text-lg font-black sm:text-xl" id="trazado-title">Leé la pista antes de la primera curva</h2>
        <p className="mt-1 text-sm text-content-muted">Cartografía del trazado para reconocer su forma y orientación.</p>
      </div>
      <div className="track-canvas track-grid relative flex items-center justify-center overflow-hidden p-3 sm:p-4">
        {hasMap ? (
          <img
            alt={`Cartografía del trazado de ${circuit.officialName}`}
            className="track-map relative z-content"
            draggable={false}
            onError={() => setFailedMap(circuit.track.mapImage)}
            src={circuit.track.mapImage ?? undefined}
          />
        ) : (
          <div
            aria-label={`Cartografía del trazado de ${circuit.officialName} no disponible`}
            aria-live="polite"
            className="track-map-fallback relative z-content"
            role="img"
          >
            <svg aria-hidden="true" className="h-16 w-16" viewBox="0 0 64 64">
              <path d="M10 43c7-17 15-27 25-27 12 0 21 10 19 21-2 9-12 13-21 10-8-3-14-2-23 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              <path d="m45 45 10 10M55 45 45 55" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
            </svg>
            <p className="text-sm font-bold text-content-soft">Trazado no disponible</p>
            <p className="text-xs text-content-muted">No contamos con una fuente cartográfica para este circuito.</p>
          </div>
        )}
        <span className="absolute right-4 bottom-4 font-mono text-[0.65rem] tracking-label text-content-dim uppercase">
          {hasMap ? 'Cartografía del circuito' : 'Fuente cartográfica no disponible'}
        </span>
      </div>
    </section>
  )
}

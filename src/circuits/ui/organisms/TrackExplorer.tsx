import { useState } from 'react'
import { trackZones } from '../../data/trackPresentation'
import type { Circuit } from '../../model/circuit'
import { InteractiveTrackMap } from '../molecules/InteractiveTrackMap'

interface TrackExplorerProps { circuit: Circuit }

export function TrackExplorer({ circuit }: TrackExplorerProps) {
  const [failedMap, setFailedMap] = useState<string | null>(null)
  const [activeZone, setActiveZone] = useState(1)
  const [activeHotspotId, setActiveHotspotId] = useState(circuit.track.hotspots[0]?.id)
  const hasMap = circuit.track.mapImage !== null && failedMap !== circuit.track.mapImage
  const hasCurveReference = circuit.track.referenceCoverage === 'curve-reference'
  const activeHotspot = circuit.track.hotspots.find((hotspot) => hotspot.id === activeHotspotId)

  function selectHotspot(hotspotId: string, zone: number | undefined) {
    setActiveHotspotId(hotspotId)
    if (zone) setActiveZone(zone)
  }

  return (
    <section aria-labelledby="trazado-title" className="min-w-0 overflow-hidden rounded-panel border border-white/15 bg-surface/90 shadow-panel backdrop-blur-md">
      <div className="border-b border-line-subtle p-4 sm:px-5 sm:py-4">
        <p className="eyebrow">Mapa interactivo</p>
        <h2 className="mt-1 text-lg font-black sm:text-xl" id="trazado-title">Leé la pista antes de la primera curva</h2>
      </div>
      <div className="track-canvas track-grid relative flex items-center justify-center overflow-hidden p-3 sm:p-4">
        {hasMap && hasCurveReference ? (
          <InteractiveTrackMap
            activeZone={activeZone}
            activeHotspotId={activeHotspotId}
            finishLineProgress={circuit.track.finishLineProgress}
            hotspots={circuit.track.hotspots}
            mapImage={circuit.track.mapImage ?? ''}
            name={circuit.officialName}
            onMapError={() => setFailedMap(circuit.track.mapImage)}
            onMarkerSelect={(hotspot) => selectHotspot(hotspot.id, hotspot.sector)}
            onZoneChange={setActiveZone}
          />
        ) : hasMap ? (
          <img
            alt={`Trazado de ${circuit.officialName}`}
            className="track-map relative z-content"
            draggable={false}
            onError={() => setFailedMap(circuit.track.mapImage)}
            src={circuit.track.mapImage ?? undefined}
          />
        ) : (
          <div
            aria-label={`Trazado de ${circuit.officialName} no disponible`}
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
          {hasMap ? (hasCurveReference ? 'Zonas de lectura del trazado' : 'Trazado sin referencia de curvas') : 'Fuente cartográfica no disponible'}
        </span>
      </div>

      {hasMap && hasCurveReference ? (
        <div className="track-inspector border-t border-line-subtle p-4 sm:px-5">
          <div aria-label="Zonas visuales del trazado" className="track-zone-controls" role="group">
            {trackZones.map((zone) => (
              <button
                aria-pressed={activeZone === zone.id}
                className={`track-zone-control track-zone-control--${zone.id}`}
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                type="button"
              >
                Z{zone.id}
              </button>
            ))}
            <span className="text-xs text-content-muted">Zonas visuales orientativas, no sectores oficiales.</span>
          </div>

          <div className="mt-3">
            <p className="font-mono text-[0.65rem] font-bold tracking-label text-content-dim uppercase">Curvas destacadas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {circuit.track.hotspots.map((hotspot) => (
                <button
                  aria-pressed={activeHotspotId === hotspot.id}
                  className="track-hotspot-control"
                  key={hotspot.id}
                  onClick={() => selectHotspot(hotspot.id, hotspot.sector)}
                  type="button"
                >
                  {hotspot.label}
                </button>
              ))}
            </div>
            {activeHotspot ? (
              <div aria-live="polite" className="mt-3 border-l-2 border-brand-bright pl-3">
                <p className="text-sm font-black text-content">{activeHotspot.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-content-muted">{activeHotspot.description}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : hasMap ? (
        <p className="border-t border-line-subtle px-4 py-3 text-xs text-content-muted sm:px-5">
          El trazado permanece visible, pero no se muestran zonas ni curvas porque no hay una referencia cartográfica suficiente.
        </p>
      ) : null}
    </section>
  )
}

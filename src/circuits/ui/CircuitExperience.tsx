import { useState } from 'react'
import { AsyncState } from '../../shared/ui/molecules/AsyncState'
import { circuits } from '../data/circuits'
import { CircuitControls } from './molecules/CircuitControls'
import { CircuitDetails } from './organisms/CircuitDetails'
import { CircuitHero } from './organisms/CircuitHero'
import { TrackExplorer } from './organisms/TrackExplorer'

interface CircuitExperienceProps {
  status?: 'ready' | 'loading' | 'empty' | 'error'
  onRetry?: () => void
}

export function CircuitExperience({ onRetry, status = 'ready' }: CircuitExperienceProps) {
  const [selectedId, setSelectedId] = useState(circuits[0]?.id ?? '')
  const [backdropResult, setBackdropResult] = useState<{ id: string; state: 'ready' | 'error' }>({ id: '', state: 'ready' })
  const selectedCircuit = circuits.find((circuit) => circuit.id === selectedId)

  if (status !== 'ready') return <AsyncState onRetry={onRetry} state={status} />
  if (!selectedCircuit) return <AsyncState state="empty" />
  const backdropState = backdropResult.id === selectedCircuit.id ? backdropResult.state : 'loading'

  const selectedIndex = circuits.findIndex((circuit) => circuit.id === selectedId)
  const selectByOffset = (offset: number) => {
    const nextIndex = (selectedIndex + offset + circuits.length) % circuits.length
    setSelectedId(circuits[nextIndex].id)
  }

  return (
    <main id="contenido-principal">
      <section
        aria-label={`Experiencia de ${selectedCircuit.officialName}`}
        className="circuit-stage"
        data-visual-treatment={selectedCircuit.theme.visualTreatment}
        id="inicio"
      >
        <img
          alt=""
          className="circuit-backdrop-loader"
          key={selectedCircuit.id}
          onError={() => setBackdropResult({ id: selectedCircuit.id, state: 'error' })}
          onLoad={() => setBackdropResult({ id: selectedCircuit.id, state: 'ready' })}
          src={selectedCircuit.theme.backgroundImage}
          style={{ objectPosition: selectedCircuit.theme.backgroundPosition }}
        />
        <span className="sr-only">{selectedCircuit.theme.backgroundAlt}</span>
        <div className="circuit-stage__shade" aria-hidden="true" />
        {backdropState === 'loading' ? <p className="circuit-media-state" role="status">Cargando ambiente del circuito…</p> : null}
        {backdropState === 'error' ? <p className="circuit-media-state" role="alert">No se pudo cargar el fondo. La información y el trazado siguen disponibles.</p> : null}
        <div className="page-shell relative z-content py-4 sm:py-5">
          <CircuitControls circuits={circuits} onNext={() => selectByOffset(1)} onPrevious={() => selectByOffset(-1)} onSelect={setSelectedId} selectedId={selectedId} />
          <div className="mt-5 grid min-w-0 items-start gap-5 lg:grid-cols-experience lg:gap-7">
            <div className="min-w-0">
              <CircuitHero circuit={selectedCircuit} />
              <CircuitDetails circuit={selectedCircuit} />
            </div>
            <div className="min-w-0">
              <TrackExplorer circuit={selectedCircuit} key={selectedCircuit.id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

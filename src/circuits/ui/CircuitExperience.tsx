import { useState } from 'react'
import { AsyncState } from '../../shared/ui/molecules/AsyncState'
import { officialCircuits, specialCircuits } from '../data/circuits'
import { CircuitControls } from './molecules/CircuitControls'
import { SpecialCircuitCard } from './molecules/SpecialCircuitCard'
import { CircuitDetails } from './organisms/CircuitDetails'
import { CircuitHero } from './organisms/CircuitHero'
import { TrackExplorer } from './organisms/TrackExplorer'

interface CircuitExperienceProps {
  status?: 'ready' | 'loading' | 'empty' | 'error'
  onRetry?: () => void
}

export function CircuitExperience({ onRetry, status = 'ready' }: CircuitExperienceProps) {
  const [selectedId, setSelectedId] = useState(officialCircuits[0]?.id ?? '')
  const allCircuits = [...officialCircuits, ...specialCircuits]
  const selectedCircuit = allCircuits.find((circuit) => circuit.id === selectedId)

  if (status !== 'ready') return <AsyncState onRetry={onRetry} state={status} />
  if (!selectedCircuit) return <AsyncState state="empty" />

  const selectedOfficialIndex = officialCircuits.findIndex((circuit) => circuit.id === selectedId)
  const selectByOffset = (offset: number) => {
    const nextCircuit = officialCircuits[selectedOfficialIndex + offset]
    if (nextCircuit) setSelectedId(nextCircuit.id)
  }

  return (
    <main className="page-shell" id="contenido-principal">
      <CircuitHero circuit={selectedCircuit} />
      <CircuitControls circuits={officialCircuits} onNext={() => selectByOffset(1)} onPrevious={() => selectByOffset(-1)} onSelect={setSelectedId} selectedId={selectedId} />
      <TrackExplorer circuit={selectedCircuit} key={selectedCircuit.id} />
      <CircuitDetails circuit={selectedCircuit} />
      <section className="pb-section" id="especiales" aria-labelledby="especiales-title">
        <div className="mb-6">
          <p className="eyebrow">Archivo del automovilismo</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl" id="especiales-title">Circuitos especiales</h2>
          <p className="mt-2 max-w-2xl text-content-muted">Historias fuera de la secuencia oficial, señaladas sin ambigüedad.</p>
        </div>
        {specialCircuits.map((circuit) => (
          <SpecialCircuitCard circuit={circuit} isSelected={selectedId === circuit.id} key={circuit.id} onSelect={() => setSelectedId(circuit.id)} />
        ))}
      </section>
    </main>
  )
}

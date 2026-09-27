import { useEffect, useRef } from 'react'
import { Button } from '../../../shared/ui/atoms/Button'
import type { Circuit } from '../../model/circuit'

interface CircuitControlsProps {
  circuits: Circuit[]
  selectedId: string
  onPrevious: () => void
  onNext: () => void
  onSelect: (id: string) => void
}

function getCategoryLabel(circuit: Circuit) {
  if (circuit.category === 'official') return 'Calendario 2026'
  return circuit.status === 'historic' ? 'Histórico' : 'Especial'
}

export function CircuitControls({ circuits, onNext, onPrevious, onSelect, selectedId }: CircuitControlsProps) {
  const optionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const selectedIndex = circuits.findIndex((circuit) => circuit.id === selectedId)
  const selectedCircuit = circuits[selectedIndex]

  useEffect(() => {
    const selectedOption = optionRefs.current[selectedId]
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    selectedOption?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
  }, [selectedId])

  return (
    <div id="calendario">
      <div aria-atomic="true" aria-live="polite" className="text-sm font-semibold text-content-soft">
        {selectedCircuit ? `${getCategoryLabel(selectedCircuit)} · ${selectedIndex + 1} de ${circuits.length}` : 'Circuito no disponible'}
      </div>

      <div className="mt-3 md:hidden">
        <label className="sr-only" htmlFor="circuit-selector">Seleccionar circuito</label>
        <select
          className="focus-ring min-h-control w-full rounded-control border border-line-strong bg-surface/95 px-4 py-3 text-base font-bold text-content shadow-panel"
          id="circuit-selector"
          onChange={(event) => onSelect(event.target.value)}
          value={selectedId}
        >
          {circuits.map((circuit) => (
            <option key={circuit.id} value={circuit.id}>{circuit.name} — {getCategoryLabel(circuit)}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 hidden grid-cols-circuit-selector items-stretch gap-2 md:grid">
        <Button aria-label="Circuito anterior" className="aspect-square self-center px-0" onClick={onPrevious}>
          <span aria-hidden="true">←</span>
        </Button>
        <div aria-label="Todos los circuitos disponibles" className="scrollbar-none flex min-w-0 snap-x gap-2 overflow-x-auto py-1" role="list">
          {circuits.map((circuit) => {
            const isSelected = circuit.id === selectedId
            const categoryLabel = getCategoryLabel(circuit)
            return (
              <div
                className="shrink-0 snap-center"
                key={circuit.id}
                ref={(element) => { optionRefs.current[circuit.id] = element }}
                role="listitem"
              >
                <Button
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={`${circuit.name}, ${categoryLabel}`}
                  className="circuit-option"
                  onClick={() => onSelect(circuit.id)}
                  title={circuit.name}
                  variant={isSelected ? 'primary' : 'secondary'}
                >
                  <span className="circuit-option__name">{circuit.name}</span>
                  <span className="circuit-option__category">{categoryLabel}</span>
                </Button>
              </div>
            )
          })}
        </div>
        <Button aria-label="Circuito siguiente" className="aspect-square self-center px-0" onClick={onNext}>
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </div>
  )
}

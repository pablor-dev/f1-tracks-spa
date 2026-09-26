import { Button } from '../../../shared/ui/atoms/Button'
import type { Circuit } from '../../model/circuit'

interface CircuitControlsProps {
  circuits: Circuit[]
  selectedId: string
  onPrevious: () => void
  onNext: () => void
  onSelect: (id: string) => void
}

export function CircuitControls({ circuits, onNext, onPrevious, onSelect, selectedId }: CircuitControlsProps) {
  const selectedIndex = circuits.findIndex((circuit) => circuit.id === selectedId)
  const hasOfficialSelection = selectedIndex >= 0

  return (
    <div className="mt-6" id="calendario">
      <div className="flex items-center justify-between gap-3">
        <div aria-live="polite" className="text-sm text-content-muted">
          {hasOfficialSelection ? `Ronda ${selectedIndex + 1} de ${circuits.length} disponibles` : 'Circuito especial seleccionado'}
        </div>
        <div className="flex gap-2">
          <Button aria-label="Circuito anterior" className="aspect-square px-0" disabled={!hasOfficialSelection || selectedIndex === 0} onClick={onPrevious}><span aria-hidden="true">←</span></Button>
          <Button aria-label="Circuito siguiente" className="aspect-square px-0" disabled={!hasOfficialSelection || selectedIndex === circuits.length - 1} onClick={onNext}><span aria-hidden="true">→</span></Button>
        </div>
      </div>
      <div aria-label="Circuitos oficiales de la temporada 2026" className="scrollbar-none mt-4 flex snap-x gap-2 overflow-x-auto pb-2">
        {circuits.map((circuit) => {
          const isSelected = circuit.id === selectedId
          return (
            <Button aria-current={isSelected ? 'true' : undefined} className="shrink-0 snap-start" key={circuit.id} onClick={() => onSelect(circuit.id)} variant={isSelected ? 'primary' : 'secondary'}>
              <span className="text-xs opacity-70">R{circuit.round}</span>{circuit.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

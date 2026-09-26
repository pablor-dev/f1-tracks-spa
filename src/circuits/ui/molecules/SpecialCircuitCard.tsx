import { Badge } from '../../../shared/ui/atoms/Badge'
import { Button } from '../../../shared/ui/atoms/Button'
import type { Circuit } from '../../model/circuit'

interface SpecialCircuitCardProps { circuit: Circuit; isSelected: boolean; onSelect: () => void }

export function SpecialCircuitCard({ circuit, isSelected, onSelect }: SpecialCircuitCardProps) {
  return (
    <article className="rounded-panel border border-gold/25 bg-gold-soft p-5 shadow-panel sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone="special">Circuito especial · Histórico</Badge>
        <span className="text-xs font-bold tracking-label text-gold-bright uppercase">Fuera del calendario 2026</span>
      </div>
      <h3 className="mt-5 text-xl font-black">{circuit.officialName}</h3>
      <p className="mt-1 text-sm text-content-muted">{circuit.city}, {circuit.country}</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-content-soft">{circuit.summary}</p>
      <Button aria-pressed={isSelected} className="mt-5" onClick={onSelect} variant={isSelected ? 'primary' : 'secondary'}>
        {isSelected ? 'Explorando ahora' : 'Explorar circuito histórico'}
      </Button>
    </article>
  )
}

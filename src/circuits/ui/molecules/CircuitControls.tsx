import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const carouselOptionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null)
  const mobileOptionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const selectedIndex = circuits.findIndex((circuit) => circuit.id === selectedId)
  const selectedCircuit = circuits[selectedIndex]

  const centerSelectedCarouselOption = useCallback(() => {
    const selectedOption = carouselOptionRefs.current[selectedId]
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    selectedOption?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' })
  }, [selectedId])

  useEffect(() => centerSelectedCarouselOption(), [centerSelectedCarouselOption])

  useEffect(() => {
    const desktopQuery = window.matchMedia?.('(min-width: 48rem)')
    if (!desktopQuery) return

    const centerWhenCarouselBecomesVisible = (event: MediaQueryListEvent) => {
      if (event.matches) centerSelectedCarouselOption()
    }

    desktopQuery.addEventListener('change', centerWhenCarouselBecomesVisible)
    return () => desktopQuery.removeEventListener('change', centerWhenCarouselBecomesVisible)
  }, [centerSelectedCarouselOption])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const focusedOption = mobileOptionRefs.current[focusedIndex]
    focusedOption?.focus()
    focusedOption?.scrollIntoView?.({ block: 'nearest' })
  }, [focusedIndex, isMobileMenuOpen])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) setIsMobileMenuOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isMobileMenuOpen])

  const openMobileMenu = (index = selectedIndex) => {
    setFocusedIndex(Math.max(0, index))
    setIsMobileMenuOpen(true)
  }

  const closeMobileMenu = (restoreFocus = false) => {
    setIsMobileMenuOpen(false)
    if (restoreFocus) queueMicrotask(() => mobileTriggerRef.current?.focus())
  }

  const selectFromMobileMenu = (circuit: Circuit) => {
    onSelect(circuit.id)
    closeMobileMenu(true)
  }

  const moveMobileFocus = (nextIndex: number) => {
    setFocusedIndex((nextIndex + circuits.length) % circuits.length)
  }

  return (
    <div id="calendario">
      <div aria-atomic="true" aria-live="polite" className="text-sm font-semibold text-content-soft">
        {selectedCircuit ? `${getCategoryLabel(selectedCircuit)} · ${selectedIndex + 1} de ${circuits.length}` : 'Circuito no disponible'}
      </div>

      <div className="relative mt-3 md:hidden" ref={mobileMenuRef}>
        <button
          aria-controls="mobile-circuit-list"
          aria-expanded={isMobileMenuOpen}
          aria-haspopup="listbox"
          aria-label={`Seleccionar circuito. Activo: ${selectedCircuit?.name ?? 'ninguno'}`}
          className="circuit-menu__trigger focus-ring"
          onClick={() => isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              openMobileMenu(selectedIndex)
            } else if (event.key === 'Home') {
              event.preventDefault()
              openMobileMenu(0)
            } else if (event.key === 'End') {
              event.preventDefault()
              openMobileMenu(circuits.length - 1)
            } else if (event.key === 'Escape' && isMobileMenuOpen) {
              event.preventDefault()
              closeMobileMenu()
            }
          }}
          ref={mobileTriggerRef}
          type="button"
        >
          <span className="min-w-0 break-words text-left">{selectedCircuit?.name}</span>
          <span aria-hidden="true" className={`circuit-menu__chevron ${isMobileMenuOpen ? 'is-open' : ''}`}>⌄</span>
        </button>

        {isMobileMenuOpen ? (
          <div aria-label="Circuitos disponibles" className="circuit-menu__panel" id="mobile-circuit-list" role="listbox">
            {circuits.map((circuit, index) => {
              const isSelected = circuit.id === selectedId
              const specialLabel = circuit.category === 'special' ? getCategoryLabel(circuit) : null
              return (
                <button
                  aria-label={specialLabel ? `${circuit.name}, ${specialLabel}` : circuit.name}
                  aria-selected={isSelected}
                  className="circuit-menu__option focus-ring"
                  key={circuit.id}
                  onClick={() => selectFromMobileMenu(circuit)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      moveMobileFocus(index + 1)
                    } else if (event.key === 'ArrowUp') {
                      event.preventDefault()
                      moveMobileFocus(index - 1)
                    } else if (event.key === 'Home') {
                      event.preventDefault()
                      moveMobileFocus(0)
                    } else if (event.key === 'End') {
                      event.preventDefault()
                      moveMobileFocus(circuits.length - 1)
                    } else if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      selectFromMobileMenu(circuit)
                    } else if (event.key === 'Escape') {
                      event.preventDefault()
                      closeMobileMenu(true)
                    }
                  }}
                  ref={(element) => { mobileOptionRefs.current[index] = element }}
                  role="option"
                  tabIndex={index === focusedIndex ? 0 : -1}
                  type="button"
                >
                  <span className="min-w-0 flex-1 break-words text-left leading-snug">{circuit.name}</span>
                  {specialLabel ? <span className="circuit-menu__status">{specialLabel}</span> : null}
                  {isSelected ? <span aria-label="Seleccionado" className="circuit-menu__check">✓</span> : null}
                </button>
              )
            })}
          </div>
        ) : null}
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
                ref={(element) => { carouselOptionRefs.current[circuit.id] = element }}
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

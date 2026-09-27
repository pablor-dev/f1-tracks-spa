import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { circuits, officialCircuits, specialCircuits } from '../circuits/data/circuits'
import { CircuitExperience } from '../circuits/ui/CircuitExperience'
import { App } from './App'

async function completeCircuitTransition(container: HTMLElement) {
  const stage = container.querySelector<HTMLElement>('.circuit-stage')
  const candidate = container.querySelector<HTMLImageElement>('.circuit-backdrop-loader--candidate')
  const outgoingContent = container.querySelector<HTMLElement>('.circuit-transition-content')
  expect(stage).not.toBeNull()
  expect(candidate).not.toBeNull()
  expect(outgoingContent).not.toBeNull()

  const finishAnimation = (element: HTMLElement) => {
    fireEvent(element, new Event('webkitAnimationEnd', { bubbles: true }))
  }

  fireEvent.load(candidate as HTMLImageElement)
  finishAnimation(outgoingContent as HTMLElement)
  await waitFor(() => expect(stage).toHaveAttribute('data-transition-phase', 'entering'))

  const incomingContent = container.querySelector<HTMLElement>('.circuit-transition-content')
  finishAnimation(incomingContent as HTMLElement)
  await waitFor(() => expect(stage).toHaveAttribute('data-transition-phase', 'idle'))
}

describe('dataset de circuitos', () => {
  it('incluye 23 rondas oficiales en orden y cuatro circuitos especiales', () => {
    expect(circuits).toHaveLength(27)
    expect(officialCircuits).toHaveLength(23)
    expect(officialCircuits.map((circuit) => circuit.round)).toEqual(Array.from({ length: 23 }, (_, index) => index + 1))
    expect(officialCircuits.map((circuit) => circuit.officialName)).toEqual([
      'Albert Park Grand Prix Circuit', 'Shanghai International Circuit', 'Suzuka International Racing Course',
      'Miami International Autodrome', 'Circuit Gilles Villeneuve', 'Circuit de Monaco',
      'Circuit de Barcelona-Catalunya', 'Red Bull Ring', 'Silverstone Circuit', 'Circuit de Spa-Francorchamps',
      'Hungaroring', 'Circuit Zandvoort', 'Autodromo Nazionale Monza', 'Madring', 'Baku City Circuit',
      'Sepang International Circuit', 'Marina Bay Street Circuit', 'Circuit of The Americas',
      'Autódromo Hermanos Rodríguez', 'Autódromo José Carlos Pace / Interlagos', 'Las Vegas Strip Circuit',
      'Lusail International Circuit', 'Yas Marina Circuit',
    ])
    expect(specialCircuits.map((circuit) => circuit.id)).toEqual(['bahrain', 'jeddah', 'imola', 'galvez'])
    expect(specialCircuits.every((circuit) => circuit.round === undefined)).toBe(true)
    expect(circuits.filter((circuit) => circuit.track.mapImage !== null)).toHaveLength(27)
    expect(circuits.filter((circuit) => circuit.track.mapImage === null)).toHaveLength(0)
    expect(circuits.filter((circuit) => circuit.track.referenceCoverage === 'curve-reference')).toHaveLength(27)
    expect(circuits.find((circuit) => circuit.id === 'bahrain')?.track.mapImage).toBe('/circuits/tracks/bahrain-1.svg')
    expect(circuits.find((circuit) => circuit.id === 'jeddah')?.track.mapImage).toBe('/circuits/tracks/jeddah-1.svg')
    expect(circuits.find((circuit) => circuit.id === 'imola')?.track.mapImage).toBe('/circuits/tracks/imola-3.svg')
  })
})

describe('App', () => {
  it('presenta el primer circuito oficial y su posición en la temporada', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toHaveClass('circuit-title')
    expect(screen.getByText('Calendario 2026 · 1 de 27')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Albert Park, Calendario 2026' })).toHaveAttribute('aria-current', 'true')
    expect(screen.queryByText('Albert Park Grand Prix Circuit')).not.toBeInTheDocument()
    expect(screen.queryByText(/^R\d+$/)).not.toBeInTheDocument()
  })

  it('actualiza coordinadamente fondo, contenido y trazado al seleccionar otro circuito', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Shanghai, Calendario 2026' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Shanghai' })).toBeInTheDocument()
    expect(screen.getByText('Calendario 2026 · 2 de 27')).toBeInTheDocument()
    expect(screen.getByLabelText('Experiencia de Shanghai International Circuit').querySelector('img')).toHaveAttribute('src', '/circuits/shanghai.webp')
    expect(await screen.findByRole('img', { name: /trazado.*shanghai/i })).toHaveAttribute('src', '/circuits/tracks/shanghai-1.svg')
    await user.click(screen.getByRole('button', { name: 'Circuito anterior' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
  })

  it('integra y distingue un circuito histórico en el mismo navegador', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Oscar y Juan Gálvez, Histórico' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()
    expect(screen.getByText(/histórico · fuera del calendario 2026/i)).toBeInTheDocument()
    expect(screen.getByText('Histórico · 27 de 27')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Circuitos especiales' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Circuito anterior' })).toBeEnabled()
  })

  it('navega en loop hacia ambos extremos', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Circuito anterior' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Circuito siguiente' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
  })

  it('permite cambiar el circuito con el menú móvil sin repetir la categoría oficial', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const trigger = screen.getByRole('button', { name: 'Seleccionar circuito. Activo: Albert Park' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent(/^Albert Park⌄$/)
    expect(trigger).not.toHaveTextContent('Calendario 2026')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Circuitos disponibles' })).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Monza' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Monza' })).toBeInTheDocument()
    expect(screen.getByText('Calendario 2026 · 13 de 27')).toBeInTheDocument()
    expect(screen.queryByRole('listbox', { name: 'Circuitos disponibles' })).not.toBeInTheDocument()
  })

  it('opera el menú móvil con teclado, Escape y clic exterior', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const trigger = screen.getByRole('button', { name: 'Seleccionar circuito. Activo: Albert Park' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', { name: 'Albert Park' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('option', { name: 'Shanghai' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())

    await user.click(trigger)
    await user.keyboard('{End}{Enter}')
    await completeCircuitTransition(container)
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()

    const updatedTrigger = screen.getByRole('button', { name: 'Seleccionar circuito. Activo: Oscar y Juan Gálvez' })
    await user.click(updatedTrigger)
    await user.click(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('ofrece zonas y curvas destacadas para los circuitos con referencia', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Shanghai, Calendario 2026' }))
    await completeCircuitTransition(container)
    expect(screen.getByRole('button', { name: 'T1–2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Z1' })).toBeInTheDocument()
  })

  it('mantiene disponible la experiencia si falla el fondo ambiental', () => {
    const { container } = render(<App />)
    const backdrop = container.querySelector<HTMLImageElement>('.circuit-backdrop-loader')
    expect(backdrop).not.toBeNull()
    fireEvent.error(backdrop as HTMLImageElement)
    expect(screen.getByRole('alert')).toHaveTextContent(/información y el trazado siguen disponibles/i)
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
  })
})

describe('CircuitExperience states', () => {
  it('anuncia el estado de carga sin exponer contenido incompleto', () => {
    render(<CircuitExperience status="loading" />)
    expect(screen.getByRole('status')).toHaveTextContent(/cargando/i)
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('ofrece recuperación accesible ante un error', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<CircuitExperience onRetry={onRetry} status="error" />)
    expect(screen.getByRole('alert')).toHaveTextContent(/no pudimos cargar/i)
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('comunica explícitamente el estado vacío', () => {
    render(<CircuitExperience status="empty" />)
    expect(screen.getByRole('status')).toHaveTextContent(/grilla está vacía/i)
  })
})

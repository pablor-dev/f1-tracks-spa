import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { circuits, officialCircuits, specialCircuits } from '../circuits/data/circuits'
import { CircuitExperience } from '../circuits/ui/CircuitExperience'
import { App } from './App'

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
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Shanghai, Calendario 2026' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Shanghai' })).toBeInTheDocument()
    expect(screen.getByText('Calendario 2026 · 2 de 27')).toBeInTheDocument()
    expect(screen.getByText('Caracol inicial')).toBeInTheDocument()
    expect(screen.getByLabelText('Experiencia de Shanghai International Circuit').querySelector('img')).toHaveAttribute('src', '/circuits/shanghai.webp')
    expect(screen.getByRole('img', { name: /representación esquemática.*shanghai/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Circuito anterior' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
  })

  it('integra y distingue un circuito histórico en el mismo navegador', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Oscar y Juan Gálvez, Histórico' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()
    expect(screen.getByText(/histórico · fuera del calendario 2026/i)).toBeInTheDocument()
    expect(screen.getByText('Histórico · 27 de 27')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Circuitos especiales' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Circuito anterior' })).toBeEnabled()
  })

  it('navega en loop hacia ambos extremos', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Circuito anterior' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Circuito siguiente' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
  })

  it('permite cambiar el circuito con el menú móvil sin repetir la categoría oficial', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Seleccionar circuito. Activo: Albert Park' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveTextContent(/^Albert Park⌄$/)
    expect(trigger).not.toHaveTextContent('Calendario 2026')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Circuitos disponibles' })).toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Monza' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Monza' })).toBeInTheDocument()
    expect(screen.getByText('Calendario 2026 · 13 de 27')).toBeInTheDocument()
    expect(screen.queryByRole('listbox', { name: 'Circuitos disponibles' })).not.toBeInTheDocument()
  })

  it('opera el menú móvil con teclado, Escape y clic exterior', async () => {
    const user = userEvent.setup()
    render(<App />)
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
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()

    const updatedTrigger = screen.getByRole('button', { name: 'Seleccionar circuito. Activo: Oscar y Juan Gálvez' })
    await user.click(updatedTrigger)
    await user.click(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('permite explorar un punto del trazado con el teclado', async () => {
    const user = userEvent.setup()
    render(<App />)
    const marker = screen.getByRole('button', { name: 'T9–10: Cambio rápido' })
    marker.focus()
    await user.keyboard('{Enter}')
    expect(marker).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/estabilidad y compromiso/i)).toBeInTheDocument()
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

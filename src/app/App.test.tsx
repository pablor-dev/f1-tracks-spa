import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CircuitExperience } from '../circuits/ui/CircuitExperience'
import { App } from './App'

describe('App', () => {
  it('presenta el primer circuito oficial y su posición en la temporada', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
    expect(screen.getByText('Ronda 1 de 3 disponibles')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /r1albert park/i })).toHaveAttribute('aria-current', 'true')
  })

  it('actualiza toda la experiencia al seleccionar otro circuito', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /r2shanghai/i }))
    expect(screen.getByRole('heading', { level: 1, name: 'Shanghai' })).toBeInTheDocument()
    expect(screen.getByText('Ronda 2 de 3 disponibles')).toBeInTheDocument()
    expect(screen.getByText('Caracol')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Circuito anterior' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Albert Park' })).toBeInTheDocument()
  })

  it('diferencia el circuito histórico del calendario oficial', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Explorar circuito histórico' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Oscar y Juan Gálvez' })).toBeInTheDocument()
    expect(screen.getByText('No integra el calendario 2026')).toBeInTheDocument()
    expect(screen.getByText('Circuito especial seleccionado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Circuito anterior' })).toBeDisabled()
  })

  it('permite explorar un punto del trazado con el teclado', async () => {
    const user = userEvent.setup()
    render(<App />)
    const marker = screen.getByRole('button', { name: 'T9–10: Cambio de dirección' })
    marker.focus()
    await user.keyboard('{Enter}')
    expect(marker).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/estabilidad aerodinámica/i)).toBeInTheDocument()
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

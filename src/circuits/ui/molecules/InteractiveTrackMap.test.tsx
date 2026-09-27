import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { TrackHotspot } from '../../model/circuit'
import { InteractiveTrackMap } from './InteractiveTrackMap'

const hotspot: TrackHotspot = {
  description: 'Primera frenada',
  id: 'test-1',
  label: 'T1',
  progress: 25,
  sector: 1,
  title: 'Curva uno',
  type: 'corner',
}

afterEach(() => {
  const svgPrototype = SVGElement.prototype as unknown as Record<string, unknown>
  delete svgPrototype.getTotalLength
  delete svgPrototype.getPointAtLength
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('InteractiveTrackMap', () => {
  it('sincroniza zonas, curvas y la referencia de salida/meta', async () => {
    const user = userEvent.setup()
    const onMarkerSelect = vi.fn()
    const onZoneChange = vi.fn()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('<svg width="500" height="500"><path d="M0 0 L100 0"/><path d="M0 0 L0 10"/></svg>'),
    }))
    Object.defineProperties(SVGElement.prototype, {
      getPointAtLength: { configurable: true, value: vi.fn((distance: number) => ({ x: distance, y: 0 })) },
      getTotalLength: { configurable: true, value: vi.fn(() => 100) },
    })

    render(
      <InteractiveTrackMap
        activeHotspotId={hotspot.id}
        activeZone={1}
        finishLineProgress={5}
        hotspots={[hotspot]}
        mapImage="/circuits/tracks/test.svg"
        name="Circuito de prueba"
        onMapError={vi.fn()}
        onMarkerSelect={onMarkerSelect}
        onZoneChange={onZoneChange}
      />,
    )

    expect(await screen.findByRole('group', { name: /trazado interactivo/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Línea de salida y meta' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Zona 2 del trazado de Circuito de prueba' }))
    expect(onZoneChange).toHaveBeenCalledWith(2)
    await user.click(screen.getByRole('button', { name: 'T1: Curva uno' }))
    expect(onMarkerSelect).toHaveBeenCalledWith(hotspot)
  })
})

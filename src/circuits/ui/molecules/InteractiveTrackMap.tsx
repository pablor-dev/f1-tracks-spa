import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { trackZones } from '../../data/trackPresentation'
import type { TrackHotspot } from '../../model/circuit'

interface TrackGeometry {
  finishPath?: string
  finishTransform?: string
  path: string
  viewBox: string
}

interface InteractiveTrackMapProps {
  activeZone: number
  activeHotspotId: string | undefined
  finishLineProgress: number | undefined
  hotspots: readonly TrackHotspot[]
  mapImage: string
  name: string
  onMapError: () => void
  onMarkerSelect: (hotspot: TrackHotspot) => void
  onZoneChange: (zone: number) => void
}

interface MarkerPoint {
  hotspot: TrackHotspot
  x: number
  y: number
}

interface TrackPoint { x: number; y: number }

interface TrackResource {
  failed: boolean
  geometry: TrackGeometry | null
  mapImage: string
}

function readTrackGeometry(svgSource: string): TrackGeometry | null {
  const document = new DOMParser().parseFromString(svgSource, 'image/svg+xml')
  const svg = document.querySelector('svg')
  const path = svg?.querySelector('path')
  const finishPath = svg?.querySelectorAll('path')[1]
  if (!svg || !path) return null

  const width = Number.parseFloat(svg.getAttribute('width') ?? '500')
  const height = Number.parseFloat(svg.getAttribute('height') ?? '500')
  return {
    finishPath: finishPath?.getAttribute('d') ?? undefined,
    finishTransform: finishPath?.getAttribute('transform') ?? undefined,
    path: path.getAttribute('d') ?? '',
    viewBox: svg.getAttribute('viewBox') ?? `0 0 ${width} ${height}`,
  }
}

export function InteractiveTrackMap({ activeZone, activeHotspotId, finishLineProgress, hotspots, mapImage, name, onMapError, onMarkerSelect, onZoneChange }: InteractiveTrackMapProps) {
  const finishPathRef = useRef<SVGPathElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [resource, setResource] = useState<TrackResource>({ failed: false, geometry: null, mapImage })
  const [markerPoints, setMarkerPoints] = useState<MarkerPoint[]>([])
  const [finishPoint, setFinishPoint] = useState<TrackPoint | null>(null)
  const geometry = resource.mapImage === mapImage ? resource.geometry : null
  const failed = resource.mapImage === mapImage && resource.failed

  useEffect(() => {
    const controller = new AbortController()

    fetch(mapImage, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Track SVG could not be loaded')
        return response.text()
      })
      .then((source) => {
        const nextGeometry = readTrackGeometry(source)
        if (!nextGeometry?.path) throw new Error('Track SVG has no path geometry')
        setResource({ failed: false, geometry: nextGeometry, mapImage })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setResource({ failed: true, geometry: null, mapImage })
      })

    return () => controller.abort()
  }, [mapImage])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !geometry || typeof path.getTotalLength !== 'function') {
      setMarkerPoints([])
      return
    }

    const pathLength = path.getTotalLength()
    setMarkerPoints(hotspots.flatMap((hotspot) => {
      if (hotspot.progress === undefined) return []
      const point = path.getPointAtLength(pathLength * hotspot.progress / 100)
      return [{ hotspot, x: point.x, y: point.y }]
    }))
  }, [geometry, hotspots])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !geometry || typeof path.getTotalLength !== 'function') {
      setFinishPoint(null)
      return
    }

    const pathLength = path.getTotalLength()
    let progress = finishLineProgress
    const finishPath = finishPathRef.current

    if (finishPath && typeof finishPath.getBBox === 'function') {
      try {
        const bounds = finishPath.getBBox()
        const transform = finishPath.transform.baseVal.consolidate()?.matrix
        const center = new DOMPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
          .matrixTransform(transform)
        let shortestDistance = Number.POSITIVE_INFINITY

        for (let sample = 0; sample <= 1000; sample += 1) {
          const point = path.getPointAtLength(pathLength * sample / 1000)
          const distance = (point.x - center.x) ** 2 + (point.y - center.y) ** 2
          if (distance < shortestDistance) {
            shortestDistance = distance
            progress = sample / 10
          }
        }
      } catch {
        // The explicit metadata remains the fallback for SVG implementations
        // that do not expose geometry measurement APIs.
      }
    }

    if (progress === undefined) {
      setFinishPoint(null)
      return
    }

    const point = path.getPointAtLength(pathLength * progress / 100)
    setFinishPoint({ x: point.x, y: point.y })
  }, [finishLineProgress, geometry])

  if (failed) {
    return <img alt={`Trazado de ${name}`} className="track-map relative z-content" draggable={false} onError={onMapError} src={mapImage} />
  }

  if (!geometry) {
    return <div aria-label={`Cargando trazado de ${name}`} className="track-map-loading" role="status" />
  }

  return (
    <svg aria-label={`Trazado interactivo de ${name} dividido en tres zonas visuales`} className="interactive-track-map" role="group" viewBox={geometry.viewBox}>
      <path className="interactive-track-map__base" d={geometry.path} pathLength="100" ref={pathRef} />
      {geometry.finishPath ? (
        <path className="track-finish-source" d={geometry.finishPath} ref={finishPathRef} transform={geometry.finishTransform} />
      ) : null}
      {trackZones.map((zone) => (
        <path
          aria-label={`${zone.label} del trazado de ${name}`}
          className={`interactive-track-map__zone interactive-track-map__zone--${zone.id}${activeZone === zone.id ? ' is-active' : ''}`}
          d={geometry.path}
          key={zone.id}
          onClick={() => onZoneChange(zone.id)}
          onFocus={() => onZoneChange(zone.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onZoneChange(zone.id)
            }
          }}
          pathLength="100"
          role="button"
          strokeDasharray={`${zone.end - zone.start} ${100 - (zone.end - zone.start)}`}
          strokeDashoffset={-zone.start}
          tabIndex={0}
        />
      ))}
      {markerPoints.map(({ hotspot, x, y }) => (
        <g
          aria-label={`${hotspot.label}: ${hotspot.title}`}
          aria-pressed={activeHotspotId === hotspot.id}
          className={`track-marker track-marker--${hotspot.sector ?? 1}${activeHotspotId === hotspot.id ? ' is-active' : ''}`}
          key={hotspot.id}
          onClick={() => onMarkerSelect(hotspot)}
          onFocus={() => onMarkerSelect(hotspot)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onMarkerSelect(hotspot)
            }
          }}
          role="button"
          tabIndex={0}
          transform={`translate(${x} ${y})`}
        >
          <circle aria-hidden="true" r="15" />
          <text aria-hidden="true" dy="0.35em">{hotspot.label}</text>
        </g>
      ))}
      {finishPoint ? (
        <g aria-label="Línea de salida y meta" className="track-finish-marker" role="img" transform={`translate(${finishPoint.x} ${finishPoint.y})`}>
          <circle aria-hidden="true" className="track-finish-marker__outer" r="12" />
          <circle aria-hidden="true" className="track-finish-marker__inner" r="4" />
        </g>
      ) : null}
    </svg>
  )
}

import { useReducer } from 'react'
import { AsyncState } from '../../shared/ui/molecules/AsyncState'
import { circuits } from '../data/circuits'
import { CircuitControls } from './molecules/CircuitControls'
import { CircuitDetails } from './organisms/CircuitDetails'
import { CircuitHero } from './organisms/CircuitHero'
import { TrackExplorer } from './organisms/TrackExplorer'

interface CircuitExperienceProps {
  status?: 'ready' | 'loading' | 'empty' | 'error'
  onRetry?: () => void
}

type BackdropState = 'loading' | 'ready' | 'error'
type TransitionDirection = 'previous' | 'next' | 'neutral'
type TransitionPhase = 'exiting' | 'waiting' | 'entering'

interface CircuitTransition {
  direction: TransitionDirection
  exitComplete: boolean
  fromId: string
  imageState: BackdropState
  phase: TransitionPhase
  serial: number
  targetId: string
}

interface PresentationState {
  backdropState: BackdropState
  presentedId: string
  requestedId: string
  serial: number
  transition: CircuitTransition | null
}

type PresentationAction =
  | { type: 'select'; id: string; direction: TransitionDirection }
  | { type: 'image-result'; id: string; result: Exclude<BackdropState, 'loading'>; serial?: number }
  | { type: 'exit-complete'; serial: number }
  | { type: 'entry-complete'; serial: number }

function beginEntry(state: PresentationState, transition: CircuitTransition, imageState: Exclude<BackdropState, 'loading'>): PresentationState {
  return {
    ...state,
    backdropState: imageState,
    presentedId: transition.targetId,
    transition: { ...transition, exitComplete: true, imageState, phase: 'entering' },
  }
}

function presentationReducer(state: PresentationState, action: PresentationAction): PresentationState {
  if (action.type === 'select') {
    if (action.id === state.requestedId) return state
    if (action.id === state.presentedId) return { ...state, requestedId: action.id, transition: null }

    const serial = state.serial + 1
    return {
      ...state,
      requestedId: action.id,
      serial,
      transition: {
        direction: action.direction,
        exitComplete: false,
        fromId: state.presentedId,
        imageState: 'loading',
        phase: 'exiting',
        serial,
        targetId: action.id,
      },
    }
  }

  if (action.type === 'image-result') {
    const transition = state.transition
    if (transition?.targetId === action.id && transition.serial === action.serial) {
      if (transition.exitComplete) return beginEntry(state, transition, action.result)
      return { ...state, transition: { ...transition, imageState: action.result } }
    }
    if (!transition && state.presentedId === action.id) return { ...state, backdropState: action.result }
    return state
  }

  if (action.type === 'exit-complete') {
    const transition = state.transition
    if (!transition || transition.serial !== action.serial || transition.phase !== 'exiting') return state
    if (transition.imageState === 'loading') {
      return { ...state, transition: { ...transition, exitComplete: true, phase: 'waiting' } }
    }
    return beginEntry(state, transition, transition.imageState)
  }

  const transition = state.transition
  if (!transition || transition.serial !== action.serial || transition.phase !== 'entering') return state
  return { ...state, transition: null }
}

export function CircuitExperience({ onRetry, status = 'ready' }: CircuitExperienceProps) {
  const firstCircuitId = circuits[0]?.id ?? ''
  const [presentation, dispatch] = useReducer(presentationReducer, {
    backdropState: 'loading',
    presentedId: firstCircuitId,
    requestedId: firstCircuitId,
    serial: 0,
    transition: null,
  })
  const selectedCircuit = circuits.find((circuit) => circuit.id === presentation.presentedId)
  const selectedIndex = circuits.findIndex((circuit) => circuit.id === presentation.requestedId)
  const transition = presentation.transition
  const outgoingCircuit = transition ? circuits.find((circuit) => circuit.id === transition.fromId) : null
  const incomingCircuit = transition ? circuits.find((circuit) => circuit.id === transition.targetId) : null

  if (status !== 'ready') return <AsyncState onRetry={onRetry} state={status} />
  if (!selectedCircuit) return <AsyncState state="empty" />

  const selectCircuit = (id: string, direction: TransitionDirection = 'neutral') => {
    dispatch({ direction, id, type: 'select' })
  }

  const selectByOffset = (offset: number) => {
    const nextIndex = (selectedIndex + offset + circuits.length) % circuits.length
    selectCircuit(circuits[nextIndex].id, offset < 0 ? 'previous' : 'next')
  }

  const reportImageReady = (image: HTMLImageElement, id: string, serial?: number) => {
    const reportReady = () => dispatch({ id, result: 'ready', serial, type: 'image-result' })
    if (typeof image.decode === 'function') void image.decode().then(reportReady, reportReady)
    else reportReady()
  }

  const transitionPhase = transition?.phase ?? 'idle'
  const transitionDirection = transition?.direction ?? 'neutral'

  return (
    <main id="contenido-principal">
      <section
        aria-label={`Experiencia de ${selectedCircuit.officialName}`}
        className="circuit-stage"
        data-transition-direction={transitionDirection}
        data-transition-phase={transitionPhase}
        data-visual-treatment={selectedCircuit.theme.visualTreatment}
        id="inicio"
      >
        {transition && outgoingCircuit ? (
          <img
            alt=""
            aria-hidden="true"
            className="circuit-backdrop-loader circuit-backdrop-loader--outgoing"
            key={outgoingCircuit.id}
            src={outgoingCircuit.theme.backgroundImage}
            style={{ objectPosition: outgoingCircuit.theme.backgroundPosition }}
          />
        ) : null}
        {transition && incomingCircuit ? (
          <img
            alt=""
            aria-hidden="true"
            className={`circuit-backdrop-loader circuit-backdrop-loader--candidate ${transition.imageState === 'ready' ? 'is-ready' : ''}`}
            key={incomingCircuit.id}
            onError={() => dispatch({ id: incomingCircuit.id, result: 'error', serial: transition.serial, type: 'image-result' })}
            onLoad={(event) => reportImageReady(event.currentTarget, incomingCircuit.id, transition.serial)}
            src={incomingCircuit.theme.backgroundImage}
            style={{ objectPosition: incomingCircuit.theme.backgroundPosition }}
          />
        ) : presentation.backdropState !== 'error' ? (
          <img
            alt=""
            className={`circuit-backdrop-loader ${presentation.serial > 0 ? 'circuit-backdrop-loader--settled' : ''}`}
            key={selectedCircuit.id}
            onError={() => dispatch({ id: selectedCircuit.id, result: 'error', type: 'image-result' })}
            onLoad={(event) => reportImageReady(event.currentTarget, selectedCircuit.id)}
            src={selectedCircuit.theme.backgroundImage}
            style={{ objectPosition: selectedCircuit.theme.backgroundPosition }}
          />
        ) : null}
        <span className="sr-only">{selectedCircuit.theme.backgroundAlt}</span>
        <div className="circuit-stage__shade" aria-hidden="true" />
        <div className="circuit-speed-wash" aria-hidden="true" />
        {presentation.backdropState === 'error' && transitionPhase === 'idle' ? (
          <p className="circuit-media-state" role="alert">No se pudo cargar el fondo. La información y el trazado siguen disponibles.</p>
        ) : null}
        <div className="page-shell relative z-content py-4 sm:py-5">
          <CircuitControls
            circuits={circuits}
            onNext={() => selectByOffset(1)}
            onPrevious={() => selectByOffset(-1)}
            onSelect={(id) => selectCircuit(id)}
            selectedId={presentation.requestedId}
          />
          <div
            className="circuit-transition-content mt-5 grid min-w-0 items-start gap-5 lg:grid-cols-experience lg:gap-7"
            onAnimationEnd={(event) => {
              if (!transition) return
              const expectedAnimation = transition.phase === 'entering' ? 'circuit-content-arrive' : 'circuit-content-depart'
              if (event.animationName && event.animationName !== expectedAnimation) return
              dispatch({
                serial: transition.serial,
                type: transition.phase === 'entering' ? 'entry-complete' : 'exit-complete',
              })
            }}
          >
            <div className="min-w-0">
              <CircuitHero circuit={selectedCircuit} />
              <CircuitDetails circuit={selectedCircuit} />
            </div>
            <div className="min-w-0">
              <TrackExplorer circuit={selectedCircuit} key={selectedCircuit.id} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

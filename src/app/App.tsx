import { CircuitExperience } from '../circuits/ui/CircuitExperience'
import { AppHeader } from './shell/AppHeader'

export function App() {
  return (
    <div className="min-h-screen overflow-hidden bg-canvas text-content">
      <a className="skip-link" href="#contenido-principal">
        Saltar al contenido
      </a>
      <AppHeader />
      <CircuitExperience />
    </div>
  )
}

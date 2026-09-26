import { BrandMark } from '../../shared/ui/atoms/BrandMark'

export function AppHeader() {
  return (
    <header className="relative z-header border-b border-line-subtle bg-canvas/90 backdrop-blur-xl">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4 py-3">
        <a
          className="focus-ring inline-flex items-center gap-3 rounded-control"
          href="#inicio"
          aria-label="F1 Circuitos, ir al inicio"
        >
          <BrandMark />
          <span className="text-sm font-black tracking-display uppercase">Circuitos</span>
        </a>
        <nav aria-label="Navegación principal">
          <ul className="flex items-center gap-1 text-sm font-semibold text-content-muted">
            <li><a className="nav-link" href="#calendario">Temporada</a></li>
            <li className="hidden sm:list-item"><a className="nav-link" href="#historia">Historia</a></li>
            <li><a className="nav-link" href="#especiales">Especiales</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

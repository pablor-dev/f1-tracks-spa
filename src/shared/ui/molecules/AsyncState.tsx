import { Button } from '../atoms/Button'
import { Skeleton } from '../atoms/Skeleton'

interface AsyncStateProps {
  state: 'loading' | 'empty' | 'error'
  onRetry?: () => void
}

export function AsyncState({ state, onRetry }: AsyncStateProps) {
  if (state === 'loading') {
    return (
      <main className="page-shell py-section" aria-busy="true" aria-label="Cargando circuitos">
        <div role="status" className="sr-only">Cargando la experiencia de circuitos…</div>
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-5 h-16 max-w-3xl" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2"><Skeleton className="h-80" /><Skeleton className="h-80" /></div>
      </main>
    )
  }

  const isError = state === 'error'
  return (
    <main className="page-shell grid min-h-content place-items-center py-section">
      <section className="max-w-lg rounded-panel border border-line-subtle bg-surface p-8 text-center shadow-panel" role={isError ? 'alert' : 'status'}>
        <p className="eyebrow">{isError ? 'Fuera de pista' : 'Sin circuitos'}</p>
        <h1 className="mt-3 text-3xl font-black">{isError ? 'No pudimos cargar la temporada' : 'La grilla está vacía'}</h1>
        <p className="mt-3 leading-relaxed text-content-muted">
          {isError ? 'Revisá tu conexión e intentá recuperar la experiencia.' : 'Todavía no hay circuitos disponibles para explorar.'}
        </p>
        {isError && onRetry ? <Button className="mt-6" onClick={onRetry} variant="primary">Reintentar</Button> : null}
      </section>
    </main>
  )
}

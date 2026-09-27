export function AppFooter() {
  return (
    <footer className="border-t border-line-subtle bg-surface" aria-labelledby="footer-title">
      <div className="page-shell py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-12">
          <div>
            <h2 className="text-sm font-black tracking-label text-gold-bright uppercase" id="footer-title">
              Circuitos Motor-sport
            </h2>
            <p className="mt-3 max-w-sm text-sm font-bold leading-relaxed text-content-soft">
              <time dateTime="2026">2026</time> · Desarrollado por y para fanáticos.
              <br />
              Hecho con cariño desde Argentina.
            </p>
          </div>

          <div className="grid gap-5 text-xs leading-relaxed text-content-muted sm:text-sm">
            <p>
              Este sitio web no es oficial ni está asociado de ninguna manera con las empresas de Fórmula 1. F1,
              FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX y las marcas relacionadas son
              marcas comerciales de Formula One.
            </p>
            <p>
              Las imágenes y representaciones gráficas de pistas y circuitos fueron obtenidas de fuentes disponibles
              en internet y se utilizan únicamente como referencia, con fines educativos y sin fines de lucro.
              Agradecemos a sus autores y titulares por el trabajo original.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

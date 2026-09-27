import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppFooter } from './AppFooter'

describe('AppFooter', () => {
  it('presenta la autoría, el descargo legal y los créditos gráficos', () => {
    render(<AppFooter />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText(/desarrollado por y para fanáticos/i)).toBeInTheDocument()
    expect(screen.getByText(/este sitio web no es oficial/i)).toBeInTheDocument()
    expect(screen.getByText(/fines educativos y sin fines de lucro/i)).toBeInTheDocument()
    expect(screen.getByText(/agradecemos a sus autores y titulares/i)).toBeInTheDocument()
  })
})

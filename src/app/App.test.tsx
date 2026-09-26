import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('presents the Formula 1 circuits experience', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /formula 1 circuits, built for exploration/i,
      }),
    ).toBeInTheDocument()
  })
})

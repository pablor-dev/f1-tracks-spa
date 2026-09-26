import type { ReactNode } from 'react'

type BadgeTone = 'brand' | 'official' | 'special' | 'neutral'

interface BadgeProps {
  children: ReactNode
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  brand: 'border-brand/30 bg-brand-soft text-brand-bright',
  official: 'border-positive/30 bg-positive-soft text-positive-bright',
  special: 'border-gold/30 bg-gold-soft text-gold-bright',
  neutral: 'border-line-strong bg-surface-raised text-content-muted',
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-pill border px-2.5 py-1 text-xs font-extrabold tracking-label uppercase ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}

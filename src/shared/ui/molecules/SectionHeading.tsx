import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  headingId?: string
  description?: string
  action?: ReactNode
}

export function SectionHeading({ action, description, eyebrow, headingId, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-content sm:text-3xl" id={headingId}>{title}</h2>
        {description ? <p className="mt-2 text-sm leading-relaxed text-content-muted sm:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

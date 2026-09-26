import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-brand hover:bg-brand-strong active:translate-y-px',
  secondary: 'border border-line-strong bg-surface-raised text-content hover:border-content-muted hover:bg-surface-overlay active:translate-y-px',
  ghost: 'bg-transparent text-content-muted hover:bg-surface-raised hover:text-content active:translate-y-px',
}

export function Button({ children, className = '', disabled, isLoading = false, type = 'button', variant = 'secondary', ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-control items-center justify-center gap-2 rounded-control px-4 text-sm font-bold transition-ui disabled:cursor-not-allowed disabled:opacity-disabled ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      type={type}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 animate-spin motion-reduce:animate-none" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
    </svg>
  )
}

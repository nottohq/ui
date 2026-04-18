import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../utils/cn'

type Variant = 'solid' | 'soft' | 'outline' | 'ghost'
type Tone = 'primary' | 'secondary' | 'neutral' | 'success' | 'danger' | 'warning' | 'info'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  tone?: Tone
  size?: Size
  loading?: boolean
  children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'primary',
    size = 'md',
    loading,
    disabled,
    className,
    type = 'button',
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn('notto-button', className)}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-loading={loading ? 'true' : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  )
})

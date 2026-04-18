import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../utils/cn'

type Variant = 'solid' | 'soft' | 'outline'
type Tone = 'neutral' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
type Size = 'sm' | 'md'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
  tone?: Tone
  size?: Size
  children?: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'soft', tone = 'neutral', size = 'md', className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref as Ref<HTMLSpanElement>}
      className={cn('notto-badge', className)}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      {...rest}
    >
      {children}
    </span>
  )
})

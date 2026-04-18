import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, ElementType, Ref } from 'react'
import { cn } from '../utils/cn'

type Variant = 'display' | 'title' | 'body' | 'label' | 'data' | 'caption'
type Tone = 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'danger' | 'warning' | 'info'
type Weight = 'regular' | 'medium' | 'semibold' | 'bold'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: Variant
  tone?: Tone
  weight?: Weight
  as?: ElementType
  children?: ReactNode
}

const defaultTagFor = (variant: Variant): ElementType => {
  switch (variant) {
    case 'display':
      return 'h1'
    case 'title':
      return 'h2'
    case 'label':
    case 'data':
    case 'caption':
      return 'span'
    default:
      return 'p'
  }
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', tone, weight, as, className, children, ...rest },
  ref,
) {
  const Component = (as ?? defaultTagFor(variant)) as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn('notto-text', className)}
      data-variant={variant}
      data-tone={tone}
      data-weight={weight}
      {...rest}
    >
      {children}
    </Component>
  )
})

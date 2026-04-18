import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, ElementType, Ref } from 'react'
import { cn } from '../utils/cn'

type Tone = 'neutral' | 'muted' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
type Padding = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 10 | 12
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  tone?: Tone
  padding?: Padding
  border?: boolean
  radius?: Radius
  as?: ElementType
  children?: ReactNode
}

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { tone, padding, border, radius, as: Tag = 'div', className, children, ...rest },
  ref,
) {
  const Component = Tag as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn('notto-box', className)}
      data-tone={tone}
      data-padding={padding}
      data-border={border ? 'true' : undefined}
      data-radius={radius}
      {...rest}
    >
      {children}
    </Component>
  )
})

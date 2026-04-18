import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, ElementType, Ref } from 'react'
import { cn } from '../utils/cn'

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
type Padding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
type Direction = 'row' | 'col'
type Align = 'start' | 'center' | 'end' | 'stretch'
type Justify = 'start' | 'center' | 'end' | 'between'

export interface StackProps extends HTMLAttributes<HTMLElement> {
  direction?: Direction
  gap?: Gap
  padding?: Padding
  align?: Align
  justify?: Justify
  wrap?: boolean
  as?: ElementType
  children?: ReactNode
}

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = 'col', gap = 0, padding, align, justify, wrap, as: Tag = 'div', className, children, ...rest },
  ref,
) {
  const Component = Tag as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn('notto-stack', className)}
      data-direction={direction}
      data-gap={gap}
      data-padding={padding}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? 'true' : undefined}
      {...rest}
    >
      {children}
    </Component>
  )
})

import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, ElementType, Ref } from 'react'
import { cn } from '../utils/cn'

type Width = 'narrow' | 'regular' | 'wide' | 'full'
type Padding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12

export interface PageProps extends HTMLAttributes<HTMLElement> {
  /** Theme token preset. `default` uses the root tokens; `schematic` is the shipped preset. */
  theme?: 'default' | 'schematic' | (string & {})
  /** Max-width: narrow (560px), regular (720px), wide (960px), full (100%). Default `regular`. */
  width?: Width
  /** Token-scaled padding around the content. Default 6. */
  padding?: Padding
  /** Semantic tag. Default `div`. */
  as?: ElementType
  children?: ReactNode
}

/**
 * Page — thin layout root. Applies theme attribute, max-width, and padding.
 * Setting `theme` here cascades CSS variables to all descendants.
 */
export const Page = forwardRef<HTMLElement, PageProps>(function Page(
  { theme, width = 'regular', padding = 6, as: Tag = 'div', className, children, ...rest },
  ref,
) {
  const Component = Tag as ElementType
  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn('notto-page', className)}
      data-notto-theme={theme && theme !== 'default' ? theme : undefined}
      data-width={width}
      data-padding={padding}
      {...rest}
    >
      {children}
    </Component>
  )
})

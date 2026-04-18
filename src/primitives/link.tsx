import { forwardRef } from 'react'
import type { AnchorHTMLAttributes, ReactNode, ElementType, Ref } from 'react'
import { cn } from '../utils/cn'

type Tone = 'default' | 'primary' | 'secondary' | 'muted'
type Underline = 'always' | 'hover' | 'none'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: Tone
  underline?: Underline
  external?: boolean
  as?: ElementType
  children?: ReactNode
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { tone = 'primary', underline = 'hover', external, as: Tag = 'a', className, children, ...rest },
  ref,
) {
  const Component = Tag as ElementType
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}
  return (
    <Component
      ref={ref as Ref<HTMLAnchorElement>}
      className={cn('notto-link', className)}
      data-tone={tone}
      data-underline={underline}
      {...externalProps}
      {...rest}
    >
      {children}
    </Component>
  )
})

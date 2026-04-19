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
  { tone = 'primary', underline = 'hover', external, as: Tag = 'a', className, children, target, rel, ...rest },
  ref,
) {
  const Component = Tag as ElementType
  // Any new-tab link — whether triggered by `external` or by a direct
  // `target="_blank"` consumer override — gets `rel="noopener noreferrer"`
  // forced on. Protects against reverse-tabnabbing regardless of how the
  // new tab was opened.
  const resolvedTarget = external ? '_blank' : target
  const resolvedRel =
    resolvedTarget === '_blank'
      ? rel
        ? /noopener/.test(rel) && /noreferrer/.test(rel)
          ? rel
          : `${rel} noopener noreferrer`.trim()
        : 'noopener noreferrer'
      : rel
  return (
    <Component
      ref={ref as Ref<HTMLAnchorElement>}
      className={cn('notto-link', className)}
      data-tone={tone}
      data-underline={underline}
      target={resolvedTarget}
      rel={resolvedRel}
      {...rest}
    >
      {children}
    </Component>
  )
})

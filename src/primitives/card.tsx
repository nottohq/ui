import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../utils/cn'

type Tone = 'neutral' | 'muted' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  border?: boolean
  radius?: Radius
  /** Optional header slot — rendered above the body, separated by a divider. */
  header?: ReactNode
  /** Optional footer slot — rendered below the body, separated by a divider. */
  footer?: ReactNode
  children?: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone = 'neutral', border, radius = 'md', header, footer, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      className={cn('notto-card', className)}
      data-tone={tone}
      data-border={border ? 'true' : undefined}
      data-radius={radius}
      {...rest}
    >
      {header ? <div className="notto-card__header">{header}</div> : null}
      <div className="notto-card__body">{children}</div>
      {footer ? <div className="notto-card__footer">{footer}</div> : null}
    </div>
  )
})

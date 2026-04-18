import type { ComponentType, SVGProps } from 'react'
import { cn } from '../utils/cn'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Tone = 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'danger' | 'warning' | 'info'

export interface IconProps {
  as: ComponentType<SVGProps<SVGSVGElement>>
  size?: Size
  tone?: Tone
  label?: string
  className?: string
}

const SIZE_PX: Record<Size, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
}

export const Icon = ({ as: Component, size = 'md', tone, label, className }: IconProps) => {
  const px = SIZE_PX[size]
  return (
    <Component
      className={cn('notto-icon', className)}
      data-size={size}
      data-tone={tone}
      width={px}
      height={px}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  )
}

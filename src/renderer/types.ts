import type { ComponentType, ReactNode, SVGProps } from 'react'

export interface NottoNode {
  type: string
  props?: Record<string, unknown>
  children?: NottoChildren
}

export type NottoChildren =
  | string
  | number
  | NottoNode
  | Array<string | number | NottoNode>

export type ActionHandler = (payload?: unknown) => void

export type ActionRegistry = Record<string, ActionHandler>

export type IconRegistry = Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
>

export type RendererErrorKind =
  | 'invalid-schema'
  | 'unknown-type'
  | 'invalid-props'
  | 'max-depth'
  | 'max-nodes'
  | 'max-text-length'
  | 'unknown-action'
  | 'unknown-icon'

export class RendererError extends Error {
  readonly kind: RendererErrorKind
  readonly path: readonly string[]

  constructor(message: string, kind: RendererErrorKind, path: readonly string[]) {
    super(message)
    this.name = 'RendererError'
    this.kind = kind
    this.path = path
  }
}

export interface NottoRendererProps {
  /** Agent-emitted node tree. Zod-validated before render. */
  schema: unknown
  /** Named handlers that Button `action` props resolve to. */
  actions?: ActionRegistry
  /** Named SVG components that Icon `name` props resolve to. */
  icons?: IconRegistry
  /** Max nesting depth. Default 20. */
  maxDepth?: number
  /** Max total node count across the tree. Default 1000. */
  maxNodes?: number
  /** Max characters per text node. Default 10_000. */
  maxTextLength?: number
  /** Called with a RendererError on any validation failure. */
  onError?: (error: RendererError) => void
  /** React node shown if validation fails. Default null. */
  fallback?: ReactNode
}

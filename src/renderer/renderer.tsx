import { createElement, type ComponentType, type ReactNode } from 'react'
import type { z } from 'zod'
import { Stack } from '../primitives/stack'
import { Box } from '../primitives/box'
import { Text } from '../primitives/text'
import { Button } from '../primitives/button'
import { Icon } from '../primitives/icon'
import { Link } from '../primitives/link'
import { Badge } from '../primitives/badge'
import { CodeBlock } from '../primitives/codeblock'
import {
  stackPropsSchema,
  boxPropsSchema,
  textPropsSchema,
  buttonPropsSchema,
  iconPropsSchema,
  linkPropsSchema,
  badgePropsSchema,
  codeBlockPropsSchema,
  nottoNodeSchema,
} from './schemas'
import {
  RendererError,
  type NottoNode,
  type NottoChildren,
  type NottoRendererProps,
  type ActionRegistry,
  type IconRegistry,
} from './types'

// The registry dispatches runtime-validated JSON to components. Internal
// types are loose on purpose — zod is the source of truth at the boundary;
// TypeScript can't express "every entry's component accepts the output of
// its paired schema" without dependent types.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface PrimitiveEntry {
  component: ComponentType<any>
  propsSchema: z.ZodType<any>
}

const PRIMITIVES: Record<string, PrimitiveEntry> = {
  Stack: { component: Stack, propsSchema: stackPropsSchema },
  Box: { component: Box, propsSchema: boxPropsSchema },
  Text: { component: Text, propsSchema: textPropsSchema },
  Button: { component: Button, propsSchema: buttonPropsSchema },
  Icon: { component: Icon, propsSchema: iconPropsSchema },
  Link: { component: Link, propsSchema: linkPropsSchema },
  Badge: { component: Badge, propsSchema: badgePropsSchema },
  CodeBlock: { component: CodeBlock, propsSchema: codeBlockPropsSchema },
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface RenderContext {
  actions: ActionRegistry
  icons: IconRegistry
  maxDepth: number
}

/**
 * NottoRenderer — renders a validated JSON tree as @nottohq/ui primitives.
 *
 * Every node type is checked against the allowlist. Every node's props are
 * zod-validated against the primitive's strict schema (unknown props rejected).
 * Button `action` strings are resolved via the `actions` registry;
 * Icon `name` strings are resolved via the `icons` registry.
 * Invalid input calls `onError` and returns `fallback` — never throws into the
 * React tree.
 *
 * This enforces Layer 1 (UI safety). Consuming apps compose Layer 2 (domain
 * safety) on top by validating their own schema before passing it here.
 */
export function NottoRenderer({
  schema,
  actions = {},
  icons = {},
  maxDepth = 20,
  onError,
  fallback = null,
}: NottoRendererProps): ReactNode {
  try {
    const parsed = nottoNodeSchema.safeParse(schema)
    if (!parsed.success) {
      onError?.(
        new RendererError(
          `Schema is not a valid Notto node: ${parsed.error.message}`,
          'invalid-schema',
          [],
        ),
      )
      return fallback
    }

    return renderNode(parsed.data, { actions, icons, maxDepth }, 0, [])
  } catch (err) {
    if (err instanceof RendererError) {
      onError?.(err)
      return fallback
    }
    throw err
  }
}

function renderNode(
  node: NottoNode,
  ctx: RenderContext,
  depth: number,
  path: readonly string[],
): ReactNode {
  if (depth > ctx.maxDepth) {
    throw new RendererError(
      `Max depth (${ctx.maxDepth}) exceeded`,
      'max-depth',
      path,
    )
  }

  const entry = PRIMITIVES[node.type]
  if (!entry) {
    throw new RendererError(
      `Unknown primitive type: "${node.type}"`,
      'unknown-type',
      path,
    )
  }

  const propsResult = entry.propsSchema.safeParse(node.props ?? {})
  if (!propsResult.success) {
    throw new RendererError(
      `Invalid props for ${node.type}: ${propsResult.error.message}`,
      'invalid-props',
      path,
    )
  }

  const props: Record<string, unknown> = { ...propsResult.data }

  // Wire action registry (Button, future Field, etc.)
  if (typeof props.action === 'string') {
    const handler = ctx.actions[props.action]
    if (!handler) {
      throw new RendererError(
        `Unknown action: "${props.action}"`,
        'unknown-action',
        path,
      )
    }
    props.onClick = handler
    delete props.action
  }

  // Wire icon registry (Icon primitive only).
  if (node.type === 'Icon' && typeof props.name === 'string') {
    const iconComponent = ctx.icons[props.name]
    if (!iconComponent) {
      throw new RendererError(
        `Unknown icon: "${props.name}"`,
        'unknown-icon',
        path,
      )
    }
    props.as = iconComponent
    delete props.name
  }

  const children = renderChildren(node.children, ctx, depth + 1, path)
  const key = path.length > 0 ? path.join('.') : undefined

  return createElement(entry.component, { key, ...props }, children)
}

function renderChildren(
  children: NottoChildren | undefined,
  ctx: RenderContext,
  depth: number,
  path: readonly string[],
): ReactNode {
  if (children == null) return null
  if (typeof children === 'string' || typeof children === 'number') {
    return children
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return child
      }
      return renderNode(child, ctx, depth, [...path, String(i)])
    })
  }
  return renderNode(children, ctx, depth, path)
}

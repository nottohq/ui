import { z } from 'zod'
import type { NottoNode, NottoChildren } from './types'

const spaceScale = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(8),
  z.literal(10),
  z.literal(12),
])

const radius = z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full'])
const sizeSmall = z.enum(['sm', 'md', 'lg'])
const sizeFull = z.enum(['xs', 'sm', 'md', 'lg', 'xl'])

const toneFull = z.enum([
  'neutral',
  'primary',
  'secondary',
  'muted',
  'success',
  'danger',
  'warning',
  'info',
])
const toneText = z.enum([
  'default',
  'primary',
  'secondary',
  'muted',
  'success',
  'danger',
  'warning',
  'info',
])
const toneButton = z.enum([
  'primary',
  'secondary',
  'neutral',
  'success',
  'danger',
  'warning',
  'info',
])
const toneBox = z.enum([
  'neutral',
  'muted',
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
])
const toneLink = z.enum(['default', 'primary', 'secondary', 'muted'])

/**
 * Allowlist of safe URL schemes. Blocks `javascript:`, `data:`, `vbscript:`,
 * `file:`, and anything else not in the list.
 */
const safeHref = z.string().refine(
  (h) => /^(https?:|mailto:|tel:|\/|#)/.test(h),
  { message: 'href must be http(s), mailto, tel, relative, or fragment' },
)

export const stackPropsSchema = z.strictObject({
  direction: z.enum(['row', 'col']).optional(),
  gap: spaceScale.optional(),
  padding: spaceScale.optional(),
  align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
  justify: z.enum(['start', 'center', 'end', 'between']).optional(),
  wrap: z.boolean().optional(),
  as: z
    .enum([
      'div',
      'section',
      'main',
      'header',
      'footer',
      'nav',
      'aside',
      'ul',
      'ol',
      'li',
      'form',
    ])
    .optional(),
})

export const boxPropsSchema = z.strictObject({
  tone: toneBox.optional(),
  padding: spaceScale.optional(),
  border: z.boolean().optional(),
  radius: radius.optional(),
  as: z
    .enum(['div', 'section', 'article', 'aside', 'header', 'footer', 'main'])
    .optional(),
})

export const textPropsSchema = z.strictObject({
  variant: z.enum(['display', 'title', 'body', 'label', 'data', 'caption']).optional(),
  tone: toneText.optional(),
  weight: z.enum(['regular', 'medium', 'semibold', 'bold']).optional(),
  as: z.enum(['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div']).optional(),
})

export const buttonPropsSchema = z.strictObject({
  variant: z.enum(['solid', 'soft', 'outline', 'ghost']).optional(),
  tone: toneButton.optional(),
  size: sizeSmall.optional(),
  loading: z.boolean().optional(),
  action: z.string().optional(),
  type: z.enum(['button', 'submit', 'reset']).optional(),
})

export const iconPropsSchema = z.strictObject({
  name: z.string(),
  size: sizeFull.optional(),
  tone: toneText.optional(),
  label: z.string().optional(),
})

export const linkPropsSchema = z.strictObject({
  href: safeHref,
  tone: toneLink.optional(),
  underline: z.enum(['always', 'hover', 'none']).optional(),
  external: z.boolean().optional(),
})

export const badgePropsSchema = z.strictObject({
  variant: z.enum(['solid', 'soft', 'outline']).optional(),
  tone: toneFull.optional(),
  size: z.enum(['sm', 'md']).optional(),
})

export const codeBlockPropsSchema = z.strictObject({
  tone: z.enum(['muted', 'neutral']).optional(),
  language: z.string().max(32).optional(),
})

export const pagePropsSchema = z.strictObject({
  theme: z.string().max(32).optional(),
  width: z.enum(['narrow', 'regular', 'wide', 'full']).optional(),
  padding: spaceScale.optional(),
  as: z.enum(['div', 'main', 'section', 'article']).optional(),
})

// Recursive node schema — an agent emits a tree of these.
export const nottoNodeSchema: z.ZodType<NottoNode> = z.lazy(() =>
  z.strictObject({
    type: z.string(),
    props: z.record(z.string(), z.unknown()).optional(),
    children: nottoChildrenSchema.optional(),
  }),
)

const nottoChildrenSchema: z.ZodType<NottoChildren> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    nottoNodeSchema,
    z.array(z.union([z.string(), z.number(), nottoNodeSchema])),
  ]),
)

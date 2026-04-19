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
 * Allowlist of safe URL schemes for `Link.href`. Rejects:
 *   - `javascript:` / `data:` / `vbscript:` / `file:` / any other scheme
 *   - protocol-relative URLs (`//evil.com`) — browsers would resolve these
 *     to the current page scheme, an open-redirect vector
 *   - hrefs containing control characters (NUL, DEL, 0x00-0x1f) — these are
 *     used in bypass attempts (e.g. `javas\0cript:alert(1)`)
 *   - hrefs longer than 2048 chars (reasonable browser limit; stops payload bombs)
 *
 * Leading/trailing whitespace is tolerated — trimmed before the regex check.
 */
const safeHref = z
  .string()
  .max(2048, { message: 'href too long' })
  .refine(
    (h) => {
      const trimmed = h.trim()
      // Reject control characters and DEL.
      if (/[\x00-\x1f\x7f]/.test(trimmed)) return false
      // Allowlist. Note the negative lookahead on the lone `/` — it blocks
      // `//evil.com` (protocol-relative) while still allowing `/internal/path`.
      return /^(?:https?:\/\/|mailto:|tel:|#|\/(?!\/))/.test(trimmed)
    },
    {
      message:
        'href must be http(s), mailto, tel, internal path, or fragment, and contain no control characters',
    },
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
  name: z.string().min(1).max(64),
  size: sizeFull.optional(),
  tone: toneText.optional(),
  // `label` must be non-empty when present. An empty label produces an icon
  // with an empty accessible name — worse than no label at all, since it
  // suppresses the `aria-hidden` fallback.
  label: z.string().min(1).max(256).optional(),
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

/**
 * Hard cap on the length of any single text node. The renderer enforces a
 * lower configurable cap on top of this, but this catches absurd payloads
 * at the schema layer before memory is allocated for them.
 */
const TEXT_HARD_CAP = 100_000

// Recursive node schema — an agent emits a tree of these.
export const nottoNodeSchema: z.ZodType<NottoNode> = z.lazy(() =>
  z.strictObject({
    type: z.string().max(64),
    props: z.record(z.string(), z.unknown()).optional(),
    children: nottoChildrenSchema.optional(),
  }),
)

const nottoChildrenSchema: z.ZodType<NottoChildren> = z.lazy(() =>
  z.union([
    z.string().max(TEXT_HARD_CAP),
    z.number(),
    nottoNodeSchema,
    z.array(
      z.union([z.string().max(TEXT_HARD_CAP), z.number(), nottoNodeSchema]),
    ),
  ]),
)

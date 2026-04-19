import { describe, it, expect } from 'vitest'
import {
  linkPropsSchema,
  buttonPropsSchema,
  iconPropsSchema,
  stackPropsSchema,
  nottoNodeSchema,
} from './schemas'

describe('safeHref (linkPropsSchema)', () => {
  // Accept
  it.each([
    ['https://example.com', 'explicit https'],
    ['http://example.com', 'explicit http'],
    ['https://example.com/path?q=1#frag', 'with path + query + fragment'],
    ['mailto:user@example.com', 'mailto'],
    ['tel:+1-555-0199', 'tel'],
    ['/internal/path', 'single-slash path'],
    ['/', 'root path'],
    ['#fragment', 'fragment only'],
    [' https://example.com ', 'leading/trailing whitespace'],
  ])('accepts %s (%s)', (href) => {
    const result = linkPropsSchema.safeParse({ href })
    expect(result.success).toBe(true)
  })

  // Reject
  it.each([
    ['javascript:alert(1)', 'javascript scheme'],
    ['JavaScript:alert(1)', 'case-variant javascript scheme'],
    ['data:text/html,<script>alert(1)</script>', 'data scheme'],
    ['vbscript:MsgBox("x")', 'vbscript scheme'],
    ['file:///etc/passwd', 'file scheme'],
    ['//evil.com', 'protocol-relative'],
    ['//evil.com/path', 'protocol-relative with path'],
    ['\\\\evil.com', 'backslash variant'],
    ['  //evil.com', 'whitespace + protocol-relative'],
    ['javas\0cript:alert(1)', 'null-byte bypass'],
    ['javascript\t:alert(1)', 'tab-byte bypass'],
    ['', 'empty string'],
    ['ftp://example.com', 'unsupported scheme (ftp)'],
    ['x'.repeat(3000), 'over 2048 chars'],
  ])('rejects %s (%s)', (href) => {
    const result = linkPropsSchema.safeParse({ href })
    expect(result.success).toBe(false)
  })
})

describe('strict prop schemas', () => {
  it('Button rejects unknown props', () => {
    const result = buttonPropsSchema.safeParse({
      tone: 'primary',
      extraneous: 'bad',
    })
    expect(result.success).toBe(false)
  })

  it('Button rejects out-of-enum tone', () => {
    const result = buttonPropsSchema.safeParse({ tone: 'banana' })
    expect(result.success).toBe(false)
  })

  it('Button accepts valid props', () => {
    const result = buttonPropsSchema.safeParse({
      tone: 'primary',
      variant: 'solid',
      size: 'md',
      loading: false,
      action: 'save',
    })
    expect(result.success).toBe(true)
  })

  it('Stack rejects out-of-scale gap', () => {
    const result = stackPropsSchema.safeParse({ gap: 7 })
    expect(result.success).toBe(false)
  })

  it('Icon requires name', () => {
    const result = iconPropsSchema.safeParse({ size: 'md' })
    expect(result.success).toBe(false)
  })

  it('Icon rejects empty name', () => {
    const result = iconPropsSchema.safeParse({ name: '' })
    expect(result.success).toBe(false)
  })

  it('Icon rejects empty label', () => {
    const result = iconPropsSchema.safeParse({ name: 'close', label: '' })
    expect(result.success).toBe(false)
  })

  it('Icon accepts a non-empty label', () => {
    const result = iconPropsSchema.safeParse({ name: 'close', label: 'Close' })
    expect(result.success).toBe(true)
  })

  it('Link rejects className (no escape hatches through JSON)', () => {
    const result = linkPropsSchema.safeParse({
      href: 'https://example.com',
      className: 'injected',
    })
    expect(result.success).toBe(false)
  })
})

describe('nottoNodeSchema', () => {
  it('accepts a minimal node', () => {
    const result = nottoNodeSchema.safeParse({ type: 'Stack' })
    expect(result.success).toBe(true)
  })

  it('accepts recursive trees', () => {
    const result = nottoNodeSchema.safeParse({
      type: 'Stack',
      props: { gap: 2 },
      children: [
        { type: 'Text', children: 'hi' },
        { type: 'Stack', children: [{ type: 'Text', children: 'nested' }] },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('rejects unknown top-level keys', () => {
    const result = nottoNodeSchema.safeParse({
      type: 'Stack',
      extra: 'bad',
    })
    expect(result.success).toBe(false)
  })

  it('rejects type strings over 64 chars', () => {
    const result = nottoNodeSchema.safeParse({ type: 'x'.repeat(65) })
    expect(result.success).toBe(false)
  })

  it('rejects text content over 100K chars', () => {
    const result = nottoNodeSchema.safeParse({
      type: 'Text',
      children: 'x'.repeat(100_001),
    })
    expect(result.success).toBe(false)
  })

  it('accepts text content up to 100K chars', () => {
    const result = nottoNodeSchema.safeParse({
      type: 'Text',
      children: 'x'.repeat(100_000),
    })
    expect(result.success).toBe(true)
  })
})

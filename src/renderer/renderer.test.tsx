import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { NottoRenderer } from './renderer'
import { RendererError, type RendererErrorKind } from './types'

/**
 * These tests exercise the renderer's DoS and message-hygiene defenses that
 * the schema layer can't fully cover — counting leaf children toward
 * `maxNodes`, and clamping user-controlled strings echoed into errors.
 */

// Capture the error kind the renderer emits, for kind-specific assertions.
function captureError() {
  const calls: RendererError[] = []
  const onError = vi.fn((e: RendererError) => {
    calls.push(e)
  })
  return { onError, calls }
}

describe('NottoRenderer — leaf DoS defense', () => {
  it('counts string leaves in a children array toward maxNodes', () => {
    const { onError, calls } = captureError()
    const schema = {
      type: 'Stack',
      children: Array.from({ length: 50 }, () => 'x'),
    }
    // Budget is 10, payload has 1 node + 50 leaves = 51 — way over.
    const out = renderToStaticMarkup(
      <NottoRenderer schema={schema} maxNodes={10} onError={onError} />,
    )
    expect(out).toBe('')
    expect(calls).toHaveLength(1)
    expect(calls[0]!.kind).toBe<RendererErrorKind>('max-nodes')
  })

  it('counts number leaves toward maxNodes too', () => {
    const { onError, calls } = captureError()
    const schema = {
      type: 'Stack',
      children: Array.from({ length: 50 }, () => 1),
    }
    renderToStaticMarkup(
      <NottoRenderer schema={schema} maxNodes={10} onError={onError} />,
    )
    expect(calls).toHaveLength(1)
    expect(calls[0]!.kind).toBe('max-nodes')
  })

  it('does not double-count nested nodes (budget = nodes + leaves)', () => {
    // 1 outer + 3 nested Text nodes + 0 leaves = 4 nodes. Budget 4 must pass.
    const { onError, calls } = captureError()
    const schema = {
      type: 'Stack',
      children: [
        { type: 'Text', children: 'a' },
        { type: 'Text', children: 'b' },
        { type: 'Text', children: 'c' },
      ],
    }
    const out = renderToStaticMarkup(
      <NottoRenderer schema={schema} maxNodes={4} onError={onError} />,
    )
    expect(calls).toHaveLength(0)
    expect(out).toContain('a')
    expect(out).toContain('b')
    expect(out).toContain('c')
  })
})

describe('NottoRenderer — error message hygiene', () => {
  it('clamps long user-controlled strings in unknown-type errors', () => {
    const { onError, calls } = captureError()
    // Schema cap is 64 chars for `type`, so pick a value at the edge to
    // verify clamp(60 + ellipsis) actually trims the echo.
    const bogus = 'BOGUS'.padEnd(64, 'X')
    renderToStaticMarkup(
      <NottoRenderer schema={{ type: bogus }} onError={onError} />,
    )
    expect(calls).toHaveLength(1)
    const msg = calls[0]!.message
    // The full 64-char input should NOT appear verbatim in the message;
    // the ellipsis marker should be present instead.
    expect(msg).toContain('…')
    expect(msg.length).toBeLessThan(120)
    expect(msg).not.toContain(bogus)
  })

  it('clamps long action strings in unknown-action errors', () => {
    const { onError, calls } = captureError()
    // Max action string is 64 chars per schema. Use the full 64 to force
    // the clamp (60 + …) path.
    const bogus = 'a'.repeat(64)
    renderToStaticMarkup(
      <NottoRenderer
        schema={{ type: 'Button', props: { action: bogus } }}
        actions={{}}
        onError={onError}
      />,
    )
    expect(calls).toHaveLength(1)
    const msg = calls[0]!.message
    expect(msg).toContain('Unknown action')
    expect(msg).toContain('…')
    expect(msg).not.toContain(bogus)
  })
})

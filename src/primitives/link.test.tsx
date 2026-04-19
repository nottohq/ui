import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Link } from './link'

// The Link primitive's hardening rule: any new-tab link gets
// `rel="noopener noreferrer"` forced, whether triggered by the `external`
// prop or by a direct `target="_blank"` consumer override. Same-tab links
// don't get `rel` added.
describe('Link tabnabbing defense', () => {
  it('sets target=_blank + rel=noopener noreferrer when external', () => {
    const html = renderToStaticMarkup(<Link href="https://example.com" external>go</Link>)
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('forces rel when consumer passes target=_blank directly', () => {
    const html = renderToStaticMarkup(
      <Link href="https://example.com" target="_blank">go</Link>,
    )
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('preserves extra rel values while adding noopener+noreferrer', () => {
    const html = renderToStaticMarkup(
      <Link href="https://example.com" target="_blank" rel="nofollow">go</Link>,
    )
    expect(html).toContain('target="_blank"')
    expect(html).toMatch(/rel="nofollow noopener noreferrer"/)
  })

  it('keeps an existing correct rel unchanged', () => {
    const html = renderToStaticMarkup(
      <Link
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer nofollow"
      >go</Link>,
    )
    expect(html).toMatch(/rel="noopener noreferrer nofollow"/)
  })

  it('does not add rel when target is not _blank', () => {
    const html = renderToStaticMarkup(<Link href="/internal">go</Link>)
    expect(html).not.toContain('rel="noopener')
  })
})

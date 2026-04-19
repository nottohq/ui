# Security policy

## Reporting a vulnerability

If you discover a security vulnerability in `@nottohq/ui`, please email
**tmerrien@outlook.com** rather than opening a public issue. We'll
acknowledge within 5 business days and coordinate a fix.

## Threat model

`@nottohq/ui` is designed to render UI safely when some or all of its input
comes from an untrusted source — an LLM, a form editor, a database populated
by tenant users. The specific threats the library defends against, and those
it deliberately leaves to the consuming application, are listed below.

### In scope — enforced by the library

1. **Type safety.** Only primitives in the allowlist render; unknown types
   are rejected by the renderer before reaching React.
2. **Prop safety.** Each primitive's props are validated against a strict
   zod schema. Unknown props, wrong types, and out-of-range values are
   rejected.
3. **URL safety.** `Link.href` is allowlisted to `http(s)://`, `mailto:`,
   `tel:`, internal paths (single `/`, **not** protocol-relative `//`), and
   fragments (`#`). Control characters (`0x00–0x1f`, `0x7f`) and hrefs
   longer than 2048 characters are rejected. Leading/trailing whitespace is
   tolerated — trimmed before validation to prevent whitespace-based bypass.
4. **Tabnabbing defense.** Any `Link` rendered with `target="_blank"` —
   whether set via the `external` prop or passed directly by a React
   consumer — automatically carries `rel="noopener noreferrer"`. Existing
   `rel` values are preserved and augmented, not overwritten.
5. **Action safety.** `Button.action` and `Icon.name` are strings that must
   resolve through host-provided registries (`actions` / `icons` props).
   Arbitrary click handlers or component imports cannot be injected via
   JSON. The registries are snapshotted and frozen on render — mid-render
   mutation by the consumer cannot bypass the allowlist.
6. **Accessibility-preserving inputs.** `Icon.label` must be a non-empty
   string when present (or omitted entirely). Empty labels were previously
   accepted and produced icons with empty accessible names — rejected at
   the schema boundary now.
7. **DoS caps.** Bounded by default:
   - `maxDepth` — 20 levels of nesting
   - `maxNodes` — 1000 total nodes in a tree
   - `maxTextLength` — 10,000 characters per text node
   - Hard schema cap of 100,000 characters per text node
   All caps are configurable as `NottoRenderer` props.
8. **HTML injection.** React auto-escapes string children, and no primitive
   provides a raw-HTML escape hatch. Text content renders as text.

### Out of scope — the consuming app's responsibility

1. **Domain correctness (Layer 2).** What section types are valid for your
   app, field invariants, business rules.
2. **Access control.** Who can edit what.
3. **CSRF, session management, cookie security.**
4. **Network-level attacks.** TLS, DNS, supply-chain attacks on your own
   dependencies.
5. **Rate limiting and quotas** on agent-emitted payloads.

## Recommended Content Security Policy

`@nottohq/ui` is compatible with a strict CSP:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self';
  img-src 'self' https:;
  font-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
```

The library ships a single CSS file (`@nottohq/ui/styles.css`). It does not
emit inline scripts or inline styles, does not fetch any external resources
at runtime, and does not perform runtime code compilation.

## Primitives NOT available through the runtime renderer

`Field`, `Modal`, `Toast`, `Card`, and `Table` are React components only —
they are **not** in the `@nottohq/ui/renderer` allowlist. Forms carry state,
overlays are imperative, Table takes render functions — none of these
serialize cleanly to JSON. If you need agent-authored forms or dialogs,
compose them in React-authored code.

## Versions

Pre-1.0 releases (`0.0.x`) may change APIs without notice. `0.1.0` will
establish the first stable surface. Security fixes will be backported to
the latest pre-1.0 minor where reasonable.

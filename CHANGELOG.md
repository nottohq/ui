# Changelog

All notable changes to `@nottohq/ui`.

Versions `0.0.x` are pre-1.0 — APIs may change without notice. `0.1.0` will
cut the first stable surface.

## 0.0.6 — 2026-04-19 · security hardening

Final pre-release before `0.1.0`. Focused on closing attack surface in the
runtime renderer (`@nottohq/ui/renderer`) and the `Link` primitive, plus a
privacy pass to remove private attribution from public artifacts.

### Renderer hardening

- **Block protocol-relative URLs in `Link.href`.** The previous regex let
  `//evil.com` through; browsers resolve it to the current page scheme,
  making it an open-redirect vector. Now rejected.
- **Block control characters in hrefs** (`0x00–0x1f`, `0x7f`). Prevents
  `javas\0cript:alert(1)` and similar bypass attempts.
- **Block userinfo in `http(s)` hrefs.** `https://trusted.com@evil.com/`
  is a classic phishing vector — anchor text looks trusted, effective
  origin is `evil.com`. Rejected via a combined authority-`@` check and
  `URL` constructor parse (the bare-`@` variant collapses to empty
  userinfo, which the parse check alone misses).
- **Trim tolerance on hrefs.** Leading/trailing whitespace is trimmed
  before validation so `  javascript:...` can't slip through.
- **Leaf-counting DoS defense.** String and number children inside a
  children array now count toward `maxNodes`. Previously, a single parent
  with 10,000 text leaves bypassed every cap — `maxNodes` only counted
  recursive node calls. Schema also hard-caps children arrays at 1,000
  items.
- **DoS caps** on the renderer, all configurable via `NottoRenderer` props:
  - `maxNodes` (default 1000) — total nodes *and* leaf children across the tree
  - `maxTextLength` (default 10,000) — characters per text node
  - Schema hard caps: 100K chars per text node, 1,000 items per children
    array, 64 chars for `type` / `Button.action` / `Icon.name`
- **Registry snapshotting.** `actions` and `icons` are shallow-copied and
  frozen on render, so mid-render mutation cannot bypass the allowlist.
- **Type name cap + non-empty.** Node `type` is 1–64 chars.
- **`Icon.name`, `Icon.label`, `Button.action` non-empty + capped.**
  Schema rejects empty strings and over-length values. Empty labels were
  silently producing icons with empty accessible names — worse than no
  label at all.
- **Error-message echo clamp.** User-controlled strings in
  `RendererError.message` are clamped at 60 chars with an ellipsis. Keeps
  consumer logging pipelines (Sentry, Datadog, etc.) from being flooded
  by schema-capped-but-still-large attacker input.

### Primitive hardening

- **`Link` tabnabbing defense.** Any new-tab link — whether opened via the
  `external` prop or by a direct `target="_blank"` consumer override —
  automatically gets `rel="noopener noreferrer"`. Existing `rel` values
  are preserved and augmented instead of overwritten. Closes a pitfall
  where humans using the React API could spread `target="_blank"` without
  remembering the rel pairing.

### New error kinds

- `'max-nodes'` — thrown when total node count exceeds `maxNodes`
- `'max-text-length'` — thrown when a text child exceeds `maxTextLength`

### Tests

Vitest suite covers (57 tests total):
- Safe-href accept/reject cases (protocol-relative, control chars,
  userinfo phishing variants, etc.)
- Strict prop rejection (unknown props, out-of-enum tones)
- Recursive tree validation and caps (including children-array cap)
- `Icon` and `Button.action` empty-string + max-length rejection
- `Link` tabnabbing defense (external, consumer-target, rel-merge cases)
- Renderer leaf-counting DoS defense (string/number children count
  toward `maxNodes`, nested nodes aren't double-counted)
- Renderer error-message echo clamp

### Docs

- `SECURITY.md` — threat model, reporting process, recommended CSP, now
  covering every defense above. Adds an inline-style CSP caveat for the
  React-only primitives (`Table` with `col.width`) so consumers know
  when `style-src 'self'` is reachable.
- Private attribution scrubbed from `README.md`, `CLAUDE.md`, and
  `src/theme/styles.css`. Example renamed from `truvelo-stat-card.tsx`
  to `stat-card.tsx` and rewritten as a neutral reference.

### No breaking changes to existing APIs

All `0.0.5` code keeps working. The new caps are opt-in via defaults that
are generous enough for normal usage. The `Icon.label: ""`,
`Icon.name: ""`, `Button.action: ""`, and `node.type: ""` rejections are
technically stricter than 0.0.5's behavior, but those inputs were always
broken — consumers relying on that input shape were already shipping
broken a11y or guaranteed-failing lookups.

## 0.0.5 — wave 3 primitives

Page, Card, Table. Primitive surface is now complete at 14 of 14.

## 0.0.4 — wave 2 primitives

Field, Modal, Toast (ToastProvider + useToast).

## 0.0.3 — NottoRenderer

Runtime rendering of agent-emitted JSON trees. Zod schemas per primitive,
action + icon registries, safe-href allowlist, max-depth cap.

## 0.0.2 — dogfood fixes

Stack gains `padding` prop. New `CodeBlock` primitive. Link becomes
`inline-flex` so Icon + text compose naturally. Text gains
`overflow-wrap: anywhere` safety default.

## 0.0.1 — initial publish

Primitives: Stack, Box, Text, Button, Icon, Link, Badge. Default theme
and Schematic preset. Skill bundle.

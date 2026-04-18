# Changelog

All notable changes to `@nottohq/ui`.

Versions `0.0.x` are pre-1.0 — APIs may change without notice. `0.1.0` will
cut the first stable surface.

## 0.0.6 — 2026-04-18 · security hardening

Final pre-release before `0.1.0`. Focused on closing attack surface in the
runtime renderer (`@nottohq/ui/renderer`).

### Renderer hardening

- **Block protocol-relative URLs in `Link.href`.** The previous regex let
  `//evil.com` through; browsers resolve it to the current page scheme,
  making it an open-redirect vector. Now rejected.
- **Block control characters in hrefs** (`0x00–0x1f`, `0x7f`). Prevents
  `javas\0cript:alert(1)` and similar bypass attempts.
- **Trim tolerance on hrefs.** Leading/trailing whitespace is trimmed
  before validation so `  javascript:...` can't slip through.
- **DoS caps** on the renderer, all configurable via `NottoRenderer` props:
  - `maxNodes` (default 1000) — total node count across the tree
  - `maxTextLength` (default 10,000) — characters per text node
  - Schema hard cap of 100,000 chars per string blocks absurd payloads
    before memory is allocated for them
- **Registry snapshotting.** `actions` and `icons` are shallow-copied and
  frozen on render, so mid-render mutation cannot bypass the allowlist.
- **Type name cap.** Node `type` strings are capped at 64 characters.

### New error kinds

- `'max-nodes'` — thrown when total node count exceeds `maxNodes`
- `'max-text-length'` — thrown when a text child exceeds `maxTextLength`

### Tests

Vitest added. Schema-level test suite covers:
- All safe-href accept/reject cases (protocol-relative, control chars, etc.)
- Strict prop rejection (unknown props, out-of-enum tones)
- Recursive tree validation and caps

### Docs

- `SECURITY.md` at the repo root — threat model, reporting process,
  recommended CSP.

### No breaking changes to existing APIs

All `0.0.5` code keeps working. The new caps are opt-in via defaults that
are generous enough for normal usage.

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

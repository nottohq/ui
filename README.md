# @nottohq/ui

Agent-friendly React UI primitives. Small surface. Intent-level props. Ships with a skill that teaches any LLM how to use it correctly.

## Install

```bash
npm install @nottohq/ui
```

## Use

```tsx
import { Stack, Box, Text } from '@nottohq/ui'
import '@nottohq/ui/styles.css'

export default function Hello() {
  return (
    <Stack gap={4} align="center">
      <Text variant="display">Hello</Text>
      <Text variant="body" tone="muted">Welcome to Notto UI</Text>
    </Stack>
  )
}
```

## Philosophy

- **Small surface.** 14 primitives, no more.
- **Uniform prop DSL.** `tone`, `variant`, `size`, `gap`, `padding`, `align`, `justify` mean the same thing everywhere.
- **Intent props, never geometry.** You write `gap={4}`, the library decides the pixels.
- **Theme via CSS custom properties.** Override tokens; no runtime theme objects.
- **Agents first.** Every primitive is designed to be correctly written on the first try by an LLM reading the shipped skill.

## The skill

This package ships an agent skill at `node_modules/@nottohq/ui/skill/SKILL.md`. Install it into your Claude Code workspace:

```bash
# Project-level
cp -r node_modules/@nottohq/ui/skill .claude/skills/notto-ui
```

Any agent framework that reads skills, rules, or system instructions can consume the same file. The skill teaches primitives, prop vocabulary, canonical examples, and anti-patterns.

## Status

**0.1.x — first stable surface.** The primitive catalog, prop DSL, and
renderer schema are frozen within the `0.1.x` line. Patch releases
(`0.1.1`, `0.1.2`, …) are non-breaking by contract; breaking changes
bump the minor. `1.0.0` drops the "pre-1.0" qualifier entirely.

See [`CHANGELOG.md`](./CHANGELOG.md) and [`SECURITY.md`](./SECURITY.md)
for the full history and threat model.

## License

MIT

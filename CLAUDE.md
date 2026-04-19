# CLAUDE.md

Project instructions for `@nottohq/ui`.

## What this is

Agent-friendly React UI primitives with a small surface (14 primitives), intent-level props, a shipped skill that teaches LLMs how to use the library correctly, and a runtime renderer that turns validated JSON into a React tree.

Not a generic component library. Built to be *authored by LLMs* via the skill, and *consumed by humans + agents* identically.

## Hard rules

- **Small surface.** 14 primitives total (Page, Stack, Box, Text, Icon, Button, Link, Field, Card, Table, Modal, Toast, Badge, CodeBlock). Do not add more without a real consumer proving the need.
- **Uniform prop DSL.** Every primitive uses the same vocabulary: `tone`, `variant`, `size`, `gap`, `padding`, `align`, `justify`.
- **No geometry props.** Never expose pixel values or arbitrary CSS. Always tokenized (`gap={4}`, not `gap="17px"`).
- **No escape hatches in examples.** `className` and `style` exist on types (humans may need them) but never appear in docs, examples, or the shipped skill. The skill flags them as anti-patterns.
- **Theme via CSS custom properties.** Consumers override tokens in their own global CSS. No runtime theme objects.
- **Accessibility default-on.** Primitives render semantic HTML without needing extra props.
- **kebab-case file names.** All files and directories.
- **React 19+.** Peer dependency only. No React version in dependencies.
- **No Tailwind dependency.** Library ships its own CSS file. Consumers import `@nottohq/ui/styles.css`.

## Stack

- React 19 (peer dep)
- TypeScript strict mode
- Built with tsup → ESM + CJS + `.d.ts`
- Pure CSS with custom properties, no runtime CSS-in-JS
- `clsx` is the only runtime dependency

## Build / test

- `npm run build` — produces `dist/`
- `npm run typecheck` — TS check, no emit
- Heavy testing happens through consumer repos, not here

## Git

- Branch prefixes: `feat/`, `fix/`, `chore/`, `refactor/`
- Conventional commits, imperative mood
- Never commit directly to `main` after initial scaffold

## Releasing

- Versions follow semver
- Current line: **0.1.x** — first stable surface. Patches within this
  minor are non-breaking by contract.
- Pre-1.0 breaking changes bump the minor (0.1 → 0.2 is breaking; `1.0.0`
  drops the "pre-1.0" qualifier)
- Publish with `npm publish` — `prepublishOnly` runs the build
- Tag releases with `v<version>` (annotated) and push the tag. Create a
  GitHub Release with notes.

## Not in scope

- Storybook, Chromatic, visual regression tooling
- Multi-provider LLM eval harnesses (see memory: lesson from OpenClaw)
- Monorepo tooling — this is a standalone repo

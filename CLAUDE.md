# CLAUDE.md

Project instructions for `@nottohq/ui`.

## What this is

Agent-friendly React UI primitives with a small surface (13 primitives planned), intent-level props, and a shipped skill that teaches LLMs how to use the library correctly.

Not a generic component library. Built to be *authored by LLMs* via the skill, and *consumed by humans + agents* identically.

## Hard rules

- **Small surface.** 13 primitives total (Page, Stack, Box, Text, Icon, Button, Link, Field, Card, Table, Modal, Toast, Badge). Do not add more without a real consumer proving the need.
- **Uniform prop DSL.** Every primitive uses the same vocabulary: `tone`, `variant`, `size`, `gap`, `padding`, `align`, `justify`.
- **No geometry props.** Never expose pixel values or arbitrary CSS. Always tokenized (`gap={4}`, not `gap="17px"`).
- **No escape hatches in examples.** `className` and `style` exist on types (humans may need them) but never appear in docs, examples, or the shipped skill. The skill flags them as anti-patterns.
- **Theme via CSS custom properties.** Consumers override tokens in their own global CSS. No runtime theme objects.
- **Accessibility default-on.** Primitives render semantic HTML without needing extra props.
- **kebab-case file names.** All files and directories.
- **React 19+.** Peer dependency only. No React version in dependencies.
- **No Tailwind dependency.** Library ships its own CSS file. Consumers import `@notto/ui/styles.css`.

## Stack

- React 19 (peer dep)
- TypeScript strict mode
- Built with tsup → ESM + CJS + `.d.ts`
- Pure CSS with custom properties, no runtime CSS-in-JS
- `clsx` is the only runtime dependency

## First consumer

[Truvelo admin panel](https://github.com/truvelo/truvelo-admin) drives primitive decisions. The "Schematic Protocol" theme preset in `src/theme/styles.css` mirrors Truvelo's design language.

## Build / test

- `npm run build` — produces `dist/`
- `npm run typecheck` — TS check, no emit
- Heavy testing happens through consumer repos (Truvelo), not here

## Git

- Branch prefixes: `feat/`, `fix/`, `chore/`, `refactor/`
- Conventional commits, imperative mood
- Never commit directly to `main` after initial scaffold

## Releasing

- Versions follow semver
- Pre-1.0 breaking changes bump the minor
- Publish with `npm publish` — `prepublishOnly` runs the build

## Not in scope

- Storybook, Chromatic, visual regression tooling
- Multi-provider LLM eval harnesses (see memory: lesson from OpenClaw)
- Monorepo tooling — this is a standalone repo

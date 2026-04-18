---
name: notto-ui
description: Write React UIs with @nottohq/ui — a small primitive library with intent-level props, uniform prop vocabulary, and no escape hatches.
---

# @nottohq/ui — Skill

You are writing React UI using `@nottohq/ui`. This is a small, opinionated library. Follow every rule below.

## Import

```tsx
import { Stack, Box, Text } from '@nottohq/ui'
import '@nottohq/ui/styles.css'  // once in your app root
```

## Primitives (13 planned — shipped so far in bold)

| Primitive  | Purpose                                            | Status   |
|------------|----------------------------------------------------|----------|
| Page       | Root layout + theme provider                       | planned  |
| **Stack**  | Flex container — `direction`, `gap`, `align`, `justify`, `wrap` | **shipped** |
| **Box**    | Styled container — `tone`, `padding`, `border`, `radius`        | **shipped** |
| **Text**   | Typography — `variant`, `tone`, `weight`, `as`                  | **shipped** |
| Icon       | Lucide wrapper — `name`, `size`, `tone`             | planned  |
| Button     | Action — `variant`, `size`, `tone`, `loading`       | planned  |
| Link       | Navigation — `href`, `tone`                         | planned  |
| Field      | All form inputs — `type`, `label`, `help`, `error`  | planned  |
| Card       | Content container with header/body/footer slots     | planned  |
| Table      | Data table — `columns`, `rows`, `sortable`, `paginate` | planned |
| Modal      | Overlay — `title`, `actions`, `size`                | planned  |
| Toast      | Transient notification via `useToast()`             | planned  |
| Badge      | Status indicator — `tone`, `variant`                | planned  |

## The prop vocabulary (memorize this)

| Prop | Values | Meaning |
|------|--------|---------|
| `tone`       | `neutral` `primary` `secondary` `muted` `success` `danger` `warning` `info` | Semantic color intent |
| `variant`    | primitive-specific (see per-primitive table) | Type or shape |
| `gap` / `padding` | `0` `1` `2` `3` `4` `5` `6` `8` `10` `12` | Token-scaled spacing |
| `size`       | `xs` `sm` `md` `lg` `xl` | Size scale |
| `align`      | `start` `center` `end` `stretch` | Flex cross-axis |
| `justify`    | `start` `center` `end` `between` | Flex main-axis |
| `radius`     | `none` `sm` `md` `lg` `xl` `full` | Corner radius |

## Anti-patterns — never do these

- ❌ `className="..."` — use `tone` / `variant` / `padding` / etc.
- ❌ `style={{...}}` — use token props
- ❌ Arbitrary pixel values (`gap="17px"`, `padding="13px"`) — always use the scale
- ❌ Raw HTML elements (`<div>`, `<p>`, `<h1>`, `<span>`) — use Stack, Box, Text; pass `as` if you need a specific semantic tag
- ❌ Importing from anywhere other than `@nottohq/ui` — no deep imports

If a design cannot be expressed with the props: the library is wrong; open an issue. Never reach for `className`.

## Canonical examples

### Stat card (admin dashboard)

```tsx
<Box tone="neutral" border padding={4}>
  <Stack gap={2}>
    <Text variant="label" tone="secondary">SHOPS</Text>
    <Text variant="display">42</Text>
  </Stack>
</Box>
```

### Page header

```tsx
<Stack direction="row" justify="between" align="end" gap={4}>
  <Stack gap={1}>
    <Text variant="label" tone="secondary">SYSTEM_MODULE // v1.0</Text>
    <Text variant="display">OVERVIEW</Text>
  </Stack>
  {/* actions slot goes here */}
</Stack>
```

### Simple form layout (primitives only — Field lands soon)

```tsx
<Stack gap={6} as="form">
  <Stack gap={2}>
    <Text variant="label">EMAIL</Text>
    {/* <Field type="email" /> once shipped */}
  </Stack>
  {/* submit row */}
</Stack>
```

## Theming

Consumer apps override tokens in their global CSS:

```css
:root {
  --notto-color-primary: #b02f00;
  --notto-radius-md: 0;
}
```

Or use a preset:

```tsx
<html data-notto-theme="schematic">
```

## Semantic HTML

Primitives render sensible defaults (`Text variant="display"` → `<h1>`, `variant="title"` → `<h2>`, `variant="body"` → `<p>`). Override with `as` when the layout requires a specific tag — never render raw HTML directly.

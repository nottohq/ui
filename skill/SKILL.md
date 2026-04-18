---
name: notto-ui
description: Write React UIs with @nottohq/ui — a small primitive library with intent-level props, uniform prop vocabulary, and no escape hatches.
---

# @nottohq/ui — Skill

You are writing React UI using `@nottohq/ui`. This is a small, opinionated library of **14 primitives**, intentionally closed. Follow every rule below.

## Import

```tsx
import { Stack, Box, Text } from '@nottohq/ui'
import '@nottohq/ui/styles.css'  // once in your app root
```

## The 14 primitives

| Primitive     | Purpose                                                                                                      | In renderer? |
|---------------|--------------------------------------------------------------------------------------------------------------|--------------|
| **Page**      | Root layout — `theme`, `width` (narrow / regular / wide / full), `padding`, `as`                             | yes          |
| **Stack**     | Flex container — `direction`, `gap`, `padding`, `align`, `justify`, `wrap`, `as`                             | yes          |
| **Box**       | Styled container — `tone`, `padding`, `border`, `radius`, `as`                                               | yes          |
| **Text**      | Typography — `variant`, `tone`, `weight`, `as`                                                               | yes          |
| **CodeBlock** | Preformatted code — `tone`, `language`                                                                       | yes          |
| **Button**    | Action — `variant`, `tone`, `size`, `loading`                                                                | yes          |
| **Link**      | Styled anchor — `href`, `tone`, `underline`, `external`, `as`                                                | yes          |
| **Icon**      | Wraps any SVG component — `as`, `size`, `tone`, `label`                                                      | yes          |
| **Badge**     | Status indicator — `variant`, `tone`, `size`                                                                 | yes          |
| **Field**     | All form inputs via one `type` prop — text / email / password / number / tel / url / search / date / time / textarea / select / checkbox / switch | no |
| **Modal**     | Native `<dialog>` overlay — `open`, `onDismiss`, `title`, `description`, `size`                              | no           |
| **Toast**     | `<ToastProvider>` + `useToast()` — `tone`, `title`, `description`, `duration`, `action`                      | no           |
| **Card**      | Content container with `header` / `footer` slots — `tone`, `border`, `radius`                                | no           |
| **Table**     | Data table — `columns`, `rows`, `getRowKey`, `onRowClick`, `emptyMessage`                                    | no           |

**"In renderer"** = available through the JSON runtime renderer (`@nottohq/ui/renderer`). Out-of-renderer primitives exist as React components only; agents that emit JSON can't use them directly.

## The prop vocabulary (memorize this)

| Prop              | Values                                                                       | Meaning               |
|-------------------|------------------------------------------------------------------------------|-----------------------|
| `tone`            | `neutral` `primary` `secondary` `muted` `success` `danger` `warning` `info`  | Semantic color intent |
| `variant`         | primitive-specific (see per-primitive table)                                 | Type or shape         |
| `gap` / `padding` | `0` `1` `2` `3` `4` `5` `6` `8` `10` `12`                                    | Token-scaled spacing  |
| `size`            | `xs` `sm` `md` `lg` `xl`                                                     | Size scale            |
| `align`           | `start` `center` `end` `stretch`                                             | Flex cross-axis       |
| `justify`         | `start` `center` `end` `between`                                             | Flex main-axis        |
| `radius`          | `none` `sm` `md` `lg` `xl` `full`                                            | Corner radius         |
| `width` (Page)    | `narrow` `regular` `wide` `full`                                             | Max-width preset      |

## Anti-patterns — never do these

- ❌ `className="..."` — use `tone` / `variant` / `padding` / etc.
- ❌ `style={{...}}` — use token props
- ❌ Arbitrary pixel values (`gap="17px"`, `padding="13px"`) — always use the scale
- ❌ Raw HTML elements (`<div>`, `<p>`, `<h1>`, `<span>`, `<pre>`, `<input>`, `<button>`, `<dialog>`, `<table>`) — use the primitives; pass `as` for specific semantic tags
- ❌ Importing from anywhere other than `@nottohq/ui` — no deep imports

If a design cannot be expressed with the props: the library is wrong; open an issue at https://github.com/nottohq/ui/issues. Never reach for `className`.

## Canonical examples

### Root layout

```tsx
<Page theme="schematic" width="regular" padding={6}>
  {/* everything else */}
</Page>
```

### Stat card (admin dashboard)

```tsx
<Card border>
  <Stack gap={2}>
    <Text variant="label" tone="secondary">SHOPS</Text>
    <Text variant="display">42</Text>
  </Stack>
</Card>
```

### Card with header + footer

```tsx
<Card
  border
  header={<Text variant="title">Recent appointments</Text>}
  footer={<Button variant="ghost" tone="primary">View all</Button>}
>
  <Text variant="body">5 new bookings today.</Text>
</Card>
```

### Page header

```tsx
<Stack direction="row" justify="between" align="end" gap={4}>
  <Stack gap={1}>
    <Text variant="label" tone="secondary">SYSTEM_MODULE // v1.0</Text>
    <Text variant="display">OVERVIEW</Text>
  </Stack>
  {/* actions slot */}
</Stack>
```

### Button group

```tsx
<Stack direction="row" gap={2}>
  <Button variant="solid" tone="primary">Save</Button>
  <Button variant="outline" tone="neutral">Cancel</Button>
</Stack>
```

### Icon with Button

```tsx
import { Save } from 'lucide-react'

<Button tone="primary">
  <Icon as={Save} size="sm" />
  Save changes
</Button>
```

### Status badges

```tsx
<Stack direction="row" gap={2}>
  <Badge tone="success">ACTIVE</Badge>
  <Badge tone="warning" variant="soft">PENDING</Badge>
  <Badge tone="danger"  variant="outline">FAILED</Badge>
</Stack>
```

### Link with icon

```tsx
import { Github } from 'lucide-react'

<Link href="https://github.com/nottohq/ui" external>
  <Icon as={Github} size="sm" />
  GitHub
</Link>
```

### Code block

```tsx
<CodeBlock language="bash">npm install @nottohq/ui</CodeBlock>
```

### Form (Field in action)

```tsx
<Stack as="form" gap={5}>
  <Field type="email" name="email" label="Email" required autoComplete="email" />
  <Field type="password" name="password" label="Password" required />
  <Field type="select" name="role" label="Role" options={[
    { value: 'owner', label: 'Owner' },
    { value: 'staff', label: 'Staff' },
  ]} />
  <Field type="switch" name="notify" label="Email me about important updates" />
  <Field type="textarea" name="bio" label="Short bio" help="Shown on your public profile." rows={3} />
  <Button type="submit" tone="primary">Create account</Button>
</Stack>
```

### Modal (confirm dialog)

```tsx
const [open, setOpen] = useState(false)

<>
  <Button tone="danger" onClick={() => setOpen(true)}>Delete</Button>
  <Modal
    open={open}
    onDismiss={() => setOpen(false)}
    title="Delete this shop?"
    description="This will permanently remove the shop and all of its appointments."
    size="sm"
  >
    <Stack direction="row" justify="end" gap={2}>
      <Button variant="outline" tone="neutral" onClick={() => setOpen(false)}>Cancel</Button>
      <Button tone="danger" onClick={handleDelete}>Delete</Button>
    </Stack>
  </Modal>
</>
```

### Toast

```tsx
// Wrap your app once at the root
<ToastProvider>
  {/* your app */}
</ToastProvider>

// Inside a component
const toast = useToast()

<Button tone="primary" onClick={() => toast({
  tone: 'success',
  title: 'Saved',
  description: 'Your changes are live.',
})}>
  Save
</Button>
```

### Data table

```tsx
type Appointment = { id: string; customer: string; when: string; status: 'ok' | 'late' }

<Table<Appointment>
  columns={[
    { key: 'customer', header: 'Customer' },
    { key: 'when', header: 'When', align: 'right' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge tone={row.status === 'ok' ? 'success' : 'warning'} variant="soft">
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
  ]}
  rows={appointments}
  getRowKey={(row) => row.id}
  onRowClick={(row) => navigate(`/appointments/${row.id}`)}
  emptyMessage="No appointments yet."
/>
```

## Theming

Consumer apps override tokens in their global CSS:

```css
:root {
  --notto-color-primary: #b02f00;
  --notto-radius-md: 0;
}
```

Or use the shipped preset via Page:

```tsx
<Page theme="schematic">{/* ... */}</Page>
```

## Semantic HTML

Primitives render sensible defaults: `Text variant="display"` → `<h1>`, `variant="title"` → `<h2>`, `variant="body"` → `<p>`; `CodeBlock` → `<pre><code>`; `Modal` → native `<dialog>`; `Table` → real `<table>` with `<thead>` / `<tbody>` / `scope="col"`. Override with `as` on Page/Stack/Box/Text/Link when the layout requires a specific tag — never render raw HTML directly.

## Runtime rendering (optional)

If an agent, a form editor, or a database is producing UI at *runtime* (not compiled TSX at build time), import from the renderer subpath:

```tsx
import { NottoRenderer } from '@nottohq/ui/renderer'
```

The renderer takes JSON matching this shape:

```json
{
  "type": "Page",
  "props": { "width": "regular", "padding": 6 },
  "children": [
    { "type": "Text", "props": { "variant": "title" }, "children": "Hello" },
    {
      "type": "Button",
      "props": { "tone": "primary", "action": "save" },
      "children": "Save"
    }
  ]
}
```

It validates every node against the primitive schemas (strict — unknown props rejected), enforces safe `href` schemes on `Link`, caps nesting depth, and resolves `action` / `name` strings through host-registered registries:

```tsx
import { Save, X } from 'lucide-react'

<NottoRenderer
  schema={agentEmittedJson}
  actions={{ save: handleSave, cancel: handleCancel }}
  icons={{ save: Save, cancel: X }}
  onError={(err) => console.error(err.kind, err.path, err.message)}
  fallback={<p>Unable to render.</p>}
/>
```

Unknown types, unknown props, unsafe hrefs, unknown actions, and too-deep nesting all call `onError` with a typed `RendererError` and fall back to the `fallback` node — no exception reaches the React tree.

**Renderer coverage:** Page, Stack, Box, Text, CodeBlock, Button, Link, Icon, Badge.

**Not yet in the renderer:** Field, Modal, Toast, Card, Table. Forms carry state, overlays are imperative, Table takes render functions — none of these serialize cleanly to JSON. Author them in React-authored code.

This enforces **Layer 1 — UI safety**. Consuming apps should enforce **Layer 2 — domain safety** (what section types are valid, what field shapes are allowed) by validating their own schema before passing it to the renderer. See `skill/examples/runtime-rendering.tsx` for a complete example.

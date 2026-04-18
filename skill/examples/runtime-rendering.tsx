// Runtime rendering of an agent-emitted UI tree.
//
// Use this pattern when an LLM (or a form) produces UI that must be
// rendered safely at runtime, not compiled at build time.
//
// The renderer enforces Layer 1 (UI safety):
//   • only allowlisted primitive types (unknown type → rejected)
//   • per-primitive strict prop validation (unknown or wrong-type props → rejected)
//   • safe hrefs on Link (no javascript: / data: / vbscript: schemes)
//   • max depth cap (default 20, prevents pathological nesting)
//   • named-action-only handlers (no arbitrary onClick functions through JSON)
//   • named-icon-only components (no arbitrary component imports through JSON)
//
// It does NOT enforce — that's Layer 2, the consuming app's job:
//   • domain-appropriate section types (bike shop ≠ recipe blog)
//   • field-level data validation (phone numbers, dates, business IDs)
//   • access control (who can edit what)
//   • rate limits, quotas, payload size

import { NottoRenderer, type RendererError } from '@nottohq/ui/renderer'
import { Save, X } from 'lucide-react'

// 1. Agent emits JSON. Typically from an LLM, a database, or a form editor.
const agentEmitted = {
  type: 'Stack',
  props: { gap: 4, padding: 6 },
  children: [
    {
      type: 'Text',
      props: { variant: 'title' },
      children: 'Update your shop hours',
    },
    {
      type: 'Text',
      props: { variant: 'body', tone: 'muted' },
      children: 'These changes will be visible on your public page.',
    },
    {
      type: 'Stack',
      props: { direction: 'row', gap: 2 },
      children: [
        {
          type: 'Button',
          props: { tone: 'primary', action: 'save' },
          children: [
            { type: 'Icon', props: { name: 'save', size: 'sm' } },
            'Save',
          ],
        },
        {
          type: 'Button',
          props: { variant: 'outline', tone: 'neutral', action: 'cancel' },
          children: [
            { type: 'Icon', props: { name: 'cancel', size: 'sm' } },
            'Cancel',
          ],
        },
      ],
    },
  ],
}

// 2. The host app registers named actions and icons that the schema may reference.
const actions = {
  save: () => console.log('saving...'),
  cancel: () => console.log('cancelling...'),
}

const icons = {
  save: Save,
  cancel: X,
}

// 3. Render. Any validation failure calls onError; no exception escapes into the tree.
export function AgentShopEditor() {
  return (
    <NottoRenderer
      schema={agentEmitted}
      actions={actions}
      icons={icons}
      onError={(err: RendererError) => {
        console.error(
          `[notto] ${err.kind} at ${err.path.join('.') || '(root)'}: ${err.message}`,
        )
      }}
      fallback={<p>Unable to render this section.</p>}
    />
  )
}

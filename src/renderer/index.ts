// @nottohq/ui/renderer — runtime rendering of agent-emitted JSON trees.
// Opt-in subpath. Consumers of primitives only pay zod's weight when they
// import from here.

export { NottoRenderer } from './renderer'

export {
  RendererError,
  type NottoNode,
  type NottoChildren,
  type NottoRendererProps,
  type ActionHandler,
  type ActionRegistry,
  type IconRegistry,
  type RendererErrorKind,
} from './types'

// Schemas are exported so consuming apps can compose Layer 2 validation
// (domain-appropriate section types, business invariants, access control)
// on top of the built-in Layer 1 (UI safety).
export {
  nottoNodeSchema,
  stackPropsSchema,
  boxPropsSchema,
  textPropsSchema,
  buttonPropsSchema,
  iconPropsSchema,
  linkPropsSchema,
  badgePropsSchema,
  codeBlockPropsSchema,
} from './schemas'

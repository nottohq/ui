// @nottohq/ui — primitives
// Small surface, growing deliberately from real consumer needs.
// Shipped (11): Stack, Box, Text, Button, Icon, Link, Badge, CodeBlock,
//               Field, Modal, Toast (ToastProvider + useToast)
// Planned: Page, Card, Table
//
// Note: Field / Modal / Toast are NOT in the JSON renderer (@nottohq/ui/renderer)
// in v0.0.4 — forms, imperative APIs, and overlays don't fit JSON rendering
// cleanly. Render them manually in React-authored code.

export { Stack, type StackProps } from './primitives/stack'
export { Box, type BoxProps } from './primitives/box'
export { Text, type TextProps } from './primitives/text'
export { Button, type ButtonProps } from './primitives/button'
export { Icon, type IconProps } from './primitives/icon'
export { Link, type LinkProps } from './primitives/link'
export { Badge, type BadgeProps } from './primitives/badge'
export { CodeBlock, type CodeBlockProps } from './primitives/codeblock'
export { Field, type FieldProps, type FieldOption, type FieldType } from './primitives/field'
export { Modal, type ModalProps } from './primitives/modal'
export { ToastProvider, useToast, type ToastOptions } from './primitives/toast'

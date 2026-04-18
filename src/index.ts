// @nottohq/ui — primitives
// Full planned surface shipped. The library surface is closed at 14 primitives
// unless a consuming app proves a new need.
//
// Shipped (14):
//   Structure: Page, Stack, Box
//   Typography: Text, CodeBlock
//   Actions: Button, Link, Icon
//   Status: Badge
//   Form: Field
//   Overlay: Modal
//   Transient: Toast (ToastProvider + useToast)
//   Data: Card, Table
//
// Renderer coverage (@nottohq/ui/renderer):
//   In:  Page, Stack, Box, Text, CodeBlock, Button, Link, Icon, Badge
//   Out: Field, Modal, Toast, Card, Table — these need React-authored code
//        (forms carry state, overlays are imperative, tables need render funcs)

export { Page, type PageProps } from './primitives/page'
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
export { Card, type CardProps } from './primitives/card'
export { Table, type TableProps, type TableColumn } from './primitives/table'

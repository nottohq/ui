// Reference example — a stat card built with @nottohq/ui primitives.
//
// Demonstrates the intent-level prop DSL:
// - No className, no style, no Tailwind strings.
// - Theme aesthetic is inherited from the `data-notto-theme` attribute on
//   <html> or <body>; the component itself stays theme-agnostic.

import { Box, Stack, Text } from '@nottohq/ui'

interface StatCardProps {
  label: string
  value: number | undefined
  index?: number
}

export const StatCard = ({ label, value, index = 0 }: StatCardProps) => {
  const idx = String(index + 1).padStart(2, '0')
  const serial = label.replace(/\s+/g, '').slice(0, 4).toUpperCase()
  const code = label.replace(/\s+/g, '_').toUpperCase()

  return (
    <Box border padding={4}>
      <Stack gap={3}>
        <Stack direction="row" justify="between" align="center">
          <Text variant="data" tone="secondary">SN-{idx}-{serial}</Text>
          <Text variant="data" tone="secondary">•</Text>
        </Stack>
        <Stack gap={1}>
          <Text variant="label" tone="secondary">[{idx}] {code}</Text>
          <Text variant="display">{value ?? '—'}</Text>
        </Stack>
      </Stack>
    </Box>
  )
}

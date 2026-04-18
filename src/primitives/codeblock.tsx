import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../utils/cn'

type Tone = 'muted' | 'neutral'

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  tone?: Tone
  language?: string
  children?: ReactNode
}

export const CodeBlock = forwardRef<HTMLPreElement, CodeBlockProps>(function CodeBlock(
  { tone = 'muted', language, className, children, ...rest },
  ref,
) {
  return (
    <pre
      ref={ref as Ref<HTMLPreElement>}
      className={cn('notto-codeblock', className)}
      data-tone={tone}
      data-language={language}
      {...rest}
    >
      <code>{children}</code>
    </pre>
  )
})

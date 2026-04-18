'use client'

import { useEffect, useId, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { cn } from '../utils/cn'

type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  /** Controlled open state. */
  open: boolean
  /** Called when the user dismisses (close button, backdrop click, ESC). */
  onDismiss: () => void
  /** Required for a11y — becomes the dialog's accessible name. */
  title: string
  /** Optional accessible description. */
  description?: string
  /** Max-width preset. Default `md`. */
  size?: ModalSize
  /** Dialog body content. */
  children?: ReactNode
  className?: string
}

/**
 * Modal — built on the native `<dialog>` element.
 * Gets focus trap, ESC-to-close, and body scroll lock from the platform.
 */
export function Modal({
  open,
  onDismiss,
  title,
  description,
  size = 'md',
  children,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  // Sync open prop with native dialog state
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Native dialog fires 'close' on ESC or dialog.close()
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleClose = () => onDismiss()
    dialog.addEventListener('close', handleClose)
    return () => dialog.removeEventListener('close', handleClose)
  }, [onDismiss])

  // Backdrop click: the <dialog> element itself is the backdrop;
  // the inner content wrapper is a child. So e.target === dialog means backdrop.
  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn('notto-modal', className)}
      data-size={size}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={handleBackdropClick}
    >
      <div className="notto-modal__content">
        <div className="notto-modal__header">
          <h2 id={titleId} className="notto-modal__title">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="notto-modal__description">
              {description}
            </p>
          ) : null}
        </div>
        <div className="notto-modal__body">{children}</div>
      </div>
    </dialog>
  )
}

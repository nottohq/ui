'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info'

export interface ToastOptions {
  tone?: ToastTone
  title: string
  description?: string
  /** Auto-dismiss after N ms. Pass 0 to disable. Default 5000. */
  duration?: number
  /** Optional action button inside the toast. */
  action?: { label: string; onClick: () => void }
}

interface ActiveToast extends ToastOptions {
  id: string
}

interface ToastContextValue {
  add: (toast: ToastOptions) => string
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const remove = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback(
    (options: ToastOptions) => {
      toastCounter += 1
      const id = `notto-toast-${toastCounter}`
      const duration = options.duration ?? 5000
      setToasts((prev) => [...prev, { ...options, id }])
      if (duration > 0) {
        const timer = setTimeout(() => remove(id), duration)
        timersRef.current.set(id, timer)
      }
      return id
    },
    [remove],
  )

  // Clear all timers on unmount
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ add, remove }}>
      {children}
      <div
        className="notto-toast-region"
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="notto-toast"
            data-tone={t.tone ?? 'neutral'}
            role="status"
          >
            <div className="notto-toast__body">
              <div className="notto-toast__title">{t.title}</div>
              {t.description ? (
                <div className="notto-toast__description">{t.description}</div>
              ) : null}
            </div>
            {t.action ? (
              <button
                type="button"
                className="notto-toast__action"
                onClick={() => {
                  t.action?.onClick()
                  remove(t.id)
                }}
              >
                {t.action.label}
              </button>
            ) : null}
            <button
              type="button"
              className="notto-toast__close"
              aria-label="Dismiss notification"
              onClick={() => remove(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

/** Returns a function that enqueues a new toast. */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx.add
}

'use client'

import { forwardRef, useId } from 'react'
import type { ChangeEvent, ReactNode, Ref } from 'react'
import { cn } from '../utils/cn'

// All text-like input types
type TextInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'

export type FieldType =
  | TextInputType
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'switch'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldProps {
  /** Required — becomes the control's accessible name. */
  label: string
  /** Defaults to `text`. */
  type?: FieldType
  name?: string
  value?: string | number
  defaultValue?: string | number
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  /** Helper text shown below the control. */
  help?: string
  /** Error message — styles the field as invalid and adds role="alert". */
  error?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  placeholder?: string
  autoComplete?: string
  /** For `type="textarea"`. Default 4. */
  rows?: number
  /** For `type="number"`. */
  min?: number | string
  max?: number | string
  step?: number | string
  /** For `type="select"`. */
  options?: FieldOption[]
  /** Explicit id override. If omitted, a stable auto-generated id is used. */
  id?: string
  className?: string
}

export const Field = forwardRef<HTMLElement, FieldProps>(function Field(
  {
    label,
    type = 'text',
    name,
    value,
    defaultValue,
    checked,
    defaultChecked,
    onChange,
    help,
    error,
    required,
    disabled,
    readOnly,
    placeholder,
    autoComplete,
    rows,
    min,
    max,
    step,
    options,
    id: idProp,
    className,
  },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  const helpId = help ? `${id}-help` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  const isCheckable = type === 'checkbox' || type === 'switch'

  const commonAttrs = {
    id,
    name,
    disabled,
    required,
    onChange,
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
  } as const

  let control: ReactNode

  if (type === 'textarea') {
    control = (
      <textarea
        {...commonAttrs}
        ref={ref as Ref<HTMLTextAreaElement>}
        className="notto-field__control notto-field__textarea"
        value={value as string | undefined}
        defaultValue={defaultValue as string | undefined}
        placeholder={placeholder}
        rows={rows ?? 4}
        readOnly={readOnly}
      />
    )
  } else if (type === 'select') {
    control = (
      <select
        {...commonAttrs}
        ref={ref as Ref<HTMLSelectElement>}
        className="notto-field__control notto-field__select"
        value={value as string | undefined}
        defaultValue={defaultValue as string | undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  } else if (isCheckable) {
    control = (
      <input
        {...commonAttrs}
        ref={ref as Ref<HTMLInputElement>}
        type="checkbox"
        role={type === 'switch' ? 'switch' : undefined}
        className="notto-field__control notto-field__checkable"
        checked={checked}
        defaultChecked={defaultChecked}
      />
    )
  } else {
    control = (
      <input
        {...commonAttrs}
        ref={ref as Ref<HTMLInputElement>}
        type={type}
        className="notto-field__control notto-field__input"
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        readOnly={readOnly}
        min={min}
        max={max}
        step={step}
      />
    )
  }

  return (
    <div
      className={cn('notto-field', className)}
      data-type={type}
      data-checkable={isCheckable ? 'true' : undefined}
      data-invalid={error ? 'true' : undefined}
    >
      {isCheckable ? (
        <div className="notto-field__checkable-row">
          {control}
          <label htmlFor={id} className="notto-field__label">
            {label}
            {required ? (
              <span className="notto-field__required" aria-hidden="true">
                {' *'}
              </span>
            ) : null}
          </label>
        </div>
      ) : (
        <>
          <label htmlFor={id} className="notto-field__label">
            {label}
            {required ? (
              <span className="notto-field__required" aria-hidden="true">
                {' *'}
              </span>
            ) : null}
          </label>
          {control}
        </>
      )}
      {help ? (
        <span id={helpId} className="notto-field__help">
          {help}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="notto-field__error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
})

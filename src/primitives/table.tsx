import { forwardRef } from 'react'
import type { ReactNode, Ref, TableHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type Align = 'left' | 'center' | 'right'

export interface TableColumn<T> {
  /** Stable key — used as column identifier and, by default, as the cell value accessor. */
  key: string
  /** Column heading text. */
  header: string
  /** Custom cell renderer. If omitted, renders `String(row[key])`. */
  render?: (row: T) => ReactNode
  align?: Align
  /** Optional column width (CSS length). */
  width?: string
}

export interface TableProps<T>
  extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: TableColumn<T>[]
  rows: T[]
  /** Stable key for each row. Falls back to index if omitted. */
  getRowKey?: (row: T, index: number) => string | number
  /** Called when a row is clicked — makes rows keyboard-focusable. */
  onRowClick?: (row: T) => void
  /** Shown when `rows` is empty. Default "No data." */
  emptyMessage?: string
}

/** @internal — helper for JSX inference (generic forwardRef loses type parameter). */
type TableComponent = <T>(
  props: TableProps<T> & { ref?: Ref<HTMLTableElement> },
) => ReactNode

const TableImpl = forwardRef(function Table<T>(
  {
    columns,
    rows,
    getRowKey,
    onRowClick,
    emptyMessage = 'No data.',
    className,
    ...rest
  }: TableProps<T>,
  ref: Ref<HTMLTableElement>,
) {
  return (
    <table
      ref={ref}
      className={cn('notto-table', className)}
      data-clickable={onRowClick ? 'true' : undefined}
      {...rest}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              data-align={col.align}
              style={col.width ? { width: col.width } : undefined}
              scope="col"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td className="notto-table__empty" colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, index) => {
            const key = getRowKey ? getRowKey(row, index) : index
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
              >
                {columns.map((col) => (
                  <td key={col.key} data-align={col.align}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
})

export const Table = TableImpl as TableComponent

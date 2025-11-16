// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonRole = 'button' | 'submit' | 'reset' | undefined
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ColorVariant =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'amber'
  | 'teal'
  | 'gray'

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'neutral'
  | ColorVariant

// Select option type
export interface SelectOption<T = string | number> {
  value: T
  label: string
  disabled?: boolean
}

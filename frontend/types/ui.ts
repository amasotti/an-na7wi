// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'

// Select option type
export interface SelectOption<T = string | number> {
  value: T
  label: string
  disabled?: boolean
}

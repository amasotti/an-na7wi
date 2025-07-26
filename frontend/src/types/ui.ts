// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type CardVariant = 'default' | 'elevated' | 'glass'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'url' | 'tel'

// Navigation types
export interface NavItem {
  name: string
  label: string
  to: string
  icon?: string
}

// Select option type
export interface SelectOption<T = string | number> {
  value: T
  label: string
  disabled?: boolean
}

// Form types
export interface FormField {
  name: string
  label: string
  type: InputType
  placeholder?: string
  required?: boolean
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom'
  value?: any
  message: string
}

// Modal/Dialog types
export interface DialogProps {
  open: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  persistent?: boolean
}

// Toast/Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: ButtonVariant
}

// Table/List types
export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T) => string | any
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  sortBy?: keyof T
  sortOrder?: 'asc' | 'desc'
  selectable?: boolean
  selectedRows?: T[]
}

// Filter types
export interface FilterOption<T = any> {
  label: string
  value: T
  count?: number
}

export interface FilterGroup<T = any> {
  name: string
  label: string
  type: 'select' | 'multiselect' | 'range' | 'search'
  options?: FilterOption<T>[]
  value?: any
}

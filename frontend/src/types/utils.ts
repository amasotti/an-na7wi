// Utility types

// Generic helper types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Vue specific types
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'

// Event handler types
export type EventHandler<T = Event> = (event: T) => void
export type ClickHandler = EventHandler<MouseEvent>
export type FocusHandler = EventHandler<FocusEvent>
export type InputHandler = EventHandler<InputEvent>
export type KeyboardHandler = EventHandler<KeyboardEvent>

// Async state types
export interface AsyncState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
}

// Pagination types
export interface PaginationState {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}

// Search/Filter state types
export interface SearchState {
  query: string
  filters: Record<string, any>
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    neutral: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    sans: string[]
    arabic: string[]
  }
  spacing: Record<string, string>
  breakpoints: Record<string, string>
}

// Route types
export interface RouteConfig {
  path: string
  name: string
  component: any
  meta?: {
    title?: string
    requiresAuth?: boolean
    layout?: string
  }
  children?: RouteConfig[]
}

// Store types
export interface StoreState {
  initialized: boolean
  loading: boolean
  error: string | null
}

// Date/Time utility types
export type DateFormat = 'short' | 'medium' | 'long' | 'full'
export type TimeFormat = '12h' | '24h'

// File/Upload types
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
}

export interface UploadState {
  files: FileInfo[]
  uploading: boolean
  progress: number
  error: string | null
}

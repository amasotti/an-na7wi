// Component style classes - centralized for maintainability and consistency

export const buttonClasses = {
  base: 'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

  variants: {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl focus:ring-primary-500',
    secondary:
      'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 shadow-lg hover:shadow-xl focus:ring-secondary-500',
    outline:
      'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-700 focus:ring-gray-300',
    ghost: 'text-gray-600 hover:text-primary-700 hover:bg-primary-50 focus:ring-primary-300',
  },

  sizes: {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl',
  },
}

export const cardClasses = {
  base: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 border border-white/20',

  variants: {
    default: '',
    elevated: 'shadow-2xl border-0',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30',
  },

  hover: 'hover:scale-[1.02] hover:shadow-xl',

  padding: {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },

  header: 'px-6 py-4 border-b border-gray-100 bg-gray-50/50',
  footer: 'px-6 py-4 border-t border-gray-100 bg-gray-50/50',
}

export const layoutClasses = {
  container: 'container mx-auto px-4',
  section: 'py-8',

  grid: {
    cols1: 'grid grid-cols-1 gap-6',
    cols2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    cols4: 'grid grid-cols-2 md:grid-cols-4 gap-6',
  },

  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    col: 'flex flex-col',
    wrap: 'flex flex-wrap',
  },
}

export const textClasses = {
  heading: {
    h1: 'text-4xl md:text-5xl font-bold text-gray-900 mb-6',
    h2: 'text-3xl font-bold text-gray-800 mb-4',
    h3: 'text-2xl font-semibold text-gray-800 mb-3',
    h4: 'text-xl font-semibold text-gray-700 mb-2',
  },

  body: {
    large: 'text-xl text-gray-600 leading-relaxed',
    base: 'text-gray-700 leading-relaxed',
    small: 'text-sm text-gray-600',
  },

  arabic: {
    base: 'font-arabic text-right leading-loose text-gray-900',
    large: 'font-arabic text-right leading-loose text-2xl text-gray-900',
    rtl: 'direction-rtl',
  },
}

// Helper function to combine classes
export function combineClasses(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

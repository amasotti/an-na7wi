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

export const inputClasses = {
  base: 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-200 placeholder-gray-400',

  withIcon: {
    left: 'pl-10',
    right: 'pr-10',
  },

  error: 'border-red-300 focus:border-red-500 focus:ring-red-100',

  label: 'block text-sm font-semibold text-gray-700 mb-2',
}

export const badgeClasses = {
  base: 'inline-flex items-center font-medium rounded-full',

  variants: {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  },

  sizes: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  },
}

export const navigationClasses = {
  nav: 'glass sticky top-0 z-50 border-b border-white/20',
  container: 'container mx-auto px-4',
  header: 'flex justify-between items-center h-16',

  logo: {
    link: 'flex items-center space-x-3 hover:opacity-80 transition-opacity',
    icon: 'w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg',
    text: 'text-xl font-bold text-gray-900 mb-0',
    subtitle: 'text-xs text-gray-600 -mt-1',
  },

  mobileButton: 'md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors',
  mobileMenu: 'md:hidden py-4 border-t border-white/20',
}

export const linkClasses = {
  base: 'group relative flex items-center transition-all duration-200',

  desktop: 'px-4 py-2 rounded-xl',
  mobile: 'px-4 py-3 rounded-xl w-full',

  active: 'bg-primary-100 text-primary-700',
  inactive: 'text-gray-600 hover:text-primary-700 hover:bg-primary-50',

  indicator:
    'absolute -bottom-4 left-1/2 w-1 h-1 bg-primary-500 rounded-full transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
}

export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
}

export const animationClasses = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  bounceSubtle: 'animate-bounce-subtle',
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

import { DictionaryType } from '@/types/enums'

export interface DictionaryConfig {
  name: string
  icon: string
  baseUrl?: string
  color: string
  description?: string
}

export const DICTIONARY_CONFIG: Record<DictionaryType, DictionaryConfig> = {
  [DictionaryType.ALMANY]: {
    name: 'AlMaany',
    icon: '📚',
    baseUrl: 'https://www.almaany.com',
    color: 'blue',
    description: 'Arabic-English dictionary with comprehensive definitions',
  },
  [DictionaryType.LIVING_ARABIC]: {
    name: 'Living Arabic',
    icon: '📙',
    baseUrl: 'https://livingarabic.com',
    color: 'indigo',
    description: 'Modern Arabic language resources and dictionary',
  },
  [DictionaryType.AL_LUGHATUNA]: {
    name: 'Al-Lughatuna',
    icon: '📖',
    baseUrl: 'https://al-lughatuna.com',
    color: 'green',
    description: 'Arabic language learning platform',
  },
  [DictionaryType.DERJA_NINJA]: {
    name: 'Derja Ninja',
    icon: '🥷',
    baseUrl: 'https://derja.ninja',
    color: 'purple',
    description: 'Tunisian dialect dictionary',
  },
  [DictionaryType.REVERSO]: {
    name: 'Reverso',
    icon: '🔄',
    baseUrl: 'https://context.reverso.net',
    color: 'orange',
    description: 'Context-based translations',
  },
  [DictionaryType.WIKTIONARY]: {
    name: 'Wiktionary',
    icon: '📖',
    baseUrl: 'https://en.wiktionary.org',
    color: 'gray',
    description: 'Free multilingual dictionary',
  },
  [DictionaryType.CUSTOM]: {
    name: 'Custom',
    icon: '🔗',
    color: 'gray',
    description: 'Custom dictionary link',
  },
}

export const DICTIONARY_TYPE_OPTIONS = Object.entries(DICTIONARY_CONFIG).map(([type, config]) => ({
  value: type as DictionaryType,
  label: config.name,
  icon: config.icon,
}))

export const getDictionaryBadgeClass = (type: DictionaryType): string => {
  const config = DICTIONARY_CONFIG[type] || DICTIONARY_CONFIG[DictionaryType.CUSTOM]
  const baseClasses =
    'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer'

  switch (config.color) {
    case 'blue':
      return `${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-200`
    case 'green':
      return `${baseClasses} bg-green-100 text-green-800 hover:bg-green-200`
    case 'purple':
      return `${baseClasses} bg-purple-100 text-purple-800 hover:bg-purple-200`
    case 'indigo':
      return `${baseClasses} bg-indigo-100 text-indigo-800 hover:bg-indigo-200`
    case 'orange':
      return `${baseClasses} bg-orange-100 text-orange-800 hover:bg-orange-200`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-200`
  }
}

export const getDictionaryCardClass = (type: DictionaryType): string => {
  const config = DICTIONARY_CONFIG[type]
  const baseClasses =
    'flex items-center gap-2 p-2 rounded-lg transition-colors text-sm cursor-pointer'

  switch (config.color) {
    case 'blue':
      return `${baseClasses} bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200`
    case 'green':
      return `${baseClasses} bg-green-50 text-green-700 hover:bg-green-100 border border-green-200`
    case 'purple':
      return `${baseClasses} bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200`
    case 'indigo':
      return `${baseClasses} bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200`
    case 'orange':
      return `${baseClasses} bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200`
    default:
      return `${baseClasses} bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200`
  }
}

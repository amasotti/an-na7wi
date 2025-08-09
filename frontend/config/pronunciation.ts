export interface PronunciationConfig {
  name: string
  icon: string
  urlTemplate: string
  color: string
  description: string
}

export const FORVO_CONFIG: PronunciationConfig = {
  name: 'Forvo',
  icon: '🔊',
  urlTemplate: 'https://it.forvo.com/word/###arabic-query###',
  color: 'emerald',
  description: 'Audio pronunciation dictionary',
}

/**
 * Generate Forvo pronunciation URL for given Arabic text
 */
export const generateForvoUrl = (arabicText: string): string => {
  const encodedText = encodeURIComponent(arabicText)
  return FORVO_CONFIG.urlTemplate.replace('###arabic-query###', encodedText)
}

/**
 * Get Forvo pronunciation badge CSS classes
 */
export const getForfoBadgeClass = (): string => {
  const baseClasses =
    'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer'
  return `${baseClasses} bg-emerald-100 text-emerald-800 hover:bg-emerald-200`
}

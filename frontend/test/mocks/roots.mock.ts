import type { Root, RootNormalization } from '~/types'

/**
 * export interface Root {
 *   id: string
 *   letters: string[]
 *   normalizedForm: string
 *   displayForm: string
 *   letterCount: number
 *   meaning?: string
 *   analysis?: string
 *   wordCount: number
 *   createdAt: string
 *   updatedAt: string
 * }
 */
export const mockedRoot: Root = {
  id: '1',
  letters: ['ك', 'ت', 'ب'],
  normalizedForm: 'كتب',
  displayForm: 'ك ت ب',
  letterCount: 3,
  meaning: 'to write',
  analysis: 'This root is commonly used in Arabic literature.',
  wordCount: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockedRoots: Root[] = [
  mockedRoot,
  {
    id: '2',
    letters: ['ق', 'ر', 'أ'],
    normalizedForm: 'قرأ',
    displayForm: 'ق ر أ',
    letterCount: 3,
    meaning: 'to read',
    analysis: 'This root is fundamental in Arabic education.',
    wordCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const mockedNormalizedRoots: RootNormalization[] = [
  {
    input: 'ك ت ب',
    letters: ['ك', 'ت', 'ب'],
    normalizedForm: 'كتب',
    displayForm: 'ك ت ب',
    letterCount: 3,
    isValid: true,
  },
  {
    input: 'ق ر أ',
    letters: ['ق', 'ر', 'أ'],
    normalizedForm: 'قرأ',
    displayForm: 'ق ر أ',
    letterCount: 3,
    isValid: true,
  },
  {
    input: 'س ل م',
    letters: ['س', 'ل', 'م'],
    normalizedForm: 'سلم',
    displayForm: 'س ل م',
    letterCount: 3,
    isValid: true,
  },
]

export const mockedNormalizedRoot: RootNormalization = mockedNormalizedRoots[0]!

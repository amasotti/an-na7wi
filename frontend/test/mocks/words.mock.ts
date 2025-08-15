import type { WordSummary } from '~/types'

export const mockWords: WordSummary[] = [
  {
    id: '1',
    arabic: 'كتب',
    transliteration: 'kitab',
    translation: 'book',
    partOfSpeech: 'NOUN',
    difficulty: 'BEGINNER',
    dialect: 'MSA',
  },
  {
    id: '2',
    arabic: 'كتيب',
    transliteration: 'katib',
    translation: 'writer',
    partOfSpeech: 'NOUN',
    difficulty: 'INTERMEDIATE',
    dialect: 'MSA',
  },
  {
    id: '3',
    arabic: 'EC*(',
    transliteration: 'maktab',
    translation: 'office',
    partOfSpeech: 'NOUN',
    difficulty: 'BEGINNER',
    dialect: 'MSA',
  },
]

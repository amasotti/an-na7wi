import {
  Dialect,
  Difficulty,
  MasteryLevel,
  PartOfSpeech,
  type Word,
  type WordSummary,
} from '~/types'

export const mockWordHouse: Word = {
  id: 'word-1',
  arabic: 'بيت',
  transliteration: 'bayt',
  translation: 'house',
  example: 'هذا بيت جميل',
  root: 'ب-ي-ت',
  partOfSpeech: PartOfSpeech.NOUN,
  notes: 'A common word',
  frequency: 100,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.KNOWN,
  dictionaryLinks: [],
  createdAt: '2023-01-01T00:00:00Z',
}

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

import type { Annotation, Word } from '~/types'
import { AnnotationType, Dialect, Difficulty, MasteryLevel, PartOfSpeech } from '~/types'

export const mockWord: Word = {
  id: 'word-1',
  arabic: 'كتاب',
  transliteration: 'kitab',
  translation: 'book',
  example: 'هذا كتاب جيد',
  root: 'ك-ت-ب',
  partOfSpeech: PartOfSpeech.NOUN,
  notes: 'A common word',
  frequency: 100,
  difficulty: Difficulty.BEGINNER,
  dialect: Dialect.MSA,
  masteryLevel: MasteryLevel.KNOWN,
  dictionaryLinks: [],
  createdAt: '2023-01-01T00:00:00Z',
}

export const mockAnnotation: Annotation = {
  id: '1',
  textId: '1',
  type: AnnotationType.VOCABULARY,
  content: 'هذا',
  anchorText: 'هذا نص تجريبي',
  needsReview: false,
  masteryLevel: MasteryLevel.MASTERED,
  createdAt: '2024-01-01T00:00:00Z',
  linkedWords: [],
}

export const mockAnnotationWithWords: Annotation = {
  ...mockAnnotation,
  linkedWords: [mockWord],
}

export const mockAnnotations: Annotation[] = [
  mockAnnotation,
  {
    ...mockAnnotation,
    id: '2',
    type: AnnotationType.GRAMMAR,
    content: 'Grammar explanation',
    anchorText: 'يكتب',
    linkedWords: [mockWord],
  },
]

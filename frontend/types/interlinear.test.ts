import { describe, expect, it } from 'vitest'
import type {
  InterlinearSentence,
  InterlinearText,
  InterlinearTextDetail,
  WordAlignment,
} from './entities'
import { Dialect } from './enums'

describe('Interlinear Types', () => {
  it('should create an InterlinearText object', () => {
    const text: InterlinearText = {
      id: '123',
      title: 'Test Text',
      description: 'A test',
      dialect: Dialect.MSA,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sentenceCount: 2,
    }

    expect(text.id).toBe('123')
    expect(text.title).toBe('Test Text')
    expect(text.dialect).toBe(Dialect.MSA)
  })

  it('should create a WordAlignment object', () => {
    const alignment: WordAlignment = {
      id: '456',
      arabicTokens: 'السلام',
      transliterationTokens: 'as-salamu',
      translationTokens: 'peace',
      tokenOrder: 0,
      vocabularyWordId: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    expect(alignment.arabicTokens).toBe('السلام')
    expect(alignment.vocabularyWordId).toBeUndefined()
  })

  it('should create an InterlinearSentence object with alignments', () => {
    const sentence: InterlinearSentence = {
      id: '789',
      arabicText: 'السلام عليكم',
      transliteration: 'as-salamu alaykum',
      translation: 'Peace be upon you',
      annotations: 'A greeting',
      sentenceOrder: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      alignments: [],
    }

    expect(sentence.arabicText).toBe('السلام عليكم')
    expect(sentence.alignments).toEqual([])
  })

  it('should create an InterlinearTextDetail object with nested structure', () => {
    const textDetail: InterlinearTextDetail = {
      id: '123',
      title: 'Complete Text',
      description: 'With sentences',
      dialect: Dialect.TUNISIAN,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sentences: [
        {
          id: '789',
          arabicText: 'السلام عليكم',
          transliteration: 'as-salamu alaykum',
          translation: 'Peace be upon you',
          sentenceOrder: 0,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          alignments: [
            {
              id: '456',
              arabicTokens: 'السلام',
              transliterationTokens: 'as-salamu',
              translationTokens: 'peace',
              tokenOrder: 0,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
        },
      ],
    }

    expect(textDetail.sentences).toHaveLength(1)
    expect(textDetail.sentences[0].alignments).toHaveLength(1)
    expect(textDetail.sentences[0].alignments[0].arabicTokens).toBe('السلام')
  })

  it('should allow optional fields to be undefined', () => {
    const text: InterlinearText = {
      id: '123',
      title: 'Minimal Text',
      dialect: Dialect.EGYPTIAN,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sentenceCount: 0,
    }

    expect(text.description).toBeUndefined()
  })
})

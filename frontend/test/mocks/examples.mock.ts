import type { ExampleDTO } from '~/types'

export const mockedExample: ExampleDTO = {
  arabic: 'هذا كتاب مفيد',
  transliteration: 'hatha kitab mufid',
  english: 'This is a useful book',
}

export const mockedExample2: ExampleDTO = {
  arabic: 'أقرأ الكتاب كل يوم',
  transliteration: 'aqra al-kitab kul yawum',
  english: 'I read the book every day',
}

export const mockedExamples: ExampleDTO[] = [mockedExample, mockedExample2]

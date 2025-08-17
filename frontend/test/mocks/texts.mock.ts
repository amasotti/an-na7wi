import type { TextReference } from '~/types/entities'
import { Dialect, Difficulty } from '~/types/enums'

export const mockTextReferences: TextReference[] = [
  {
    id: 'text-1',
    title: 'Arabic Reading Practice',
    difficulty: Difficulty.BEGINNER,
    dialect: Dialect.MSA,
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['grammar', 'vocabulary'],
  },
  {
    id: 'text-2', 
    title: 'Advanced Arabic Literature',
    difficulty: Difficulty.ADVANCED,
    dialect: Dialect.LEVANTINE,
    createdAt: '2024-01-20T14:15:00Z',
    tags: ['literature', 'culture', 'poetry', 'classical'],
  },
  {
    id: 'text-3',
    title: 'Modern Arabic Conversation',
    difficulty: Difficulty.INTERMEDIATE,
    dialect: Dialect.GULF,
    createdAt: '2024-02-01T09:00:00Z',
    tags: ['conversation', 'modern'],
  },
]

export const mockTextReference: TextReference = mockTextReferences[0]!

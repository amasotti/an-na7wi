import { Difficulty, type SelectOption } from '~/types'

export const difficultyOptions: SelectOption<Difficulty>[] = [
  { label: 'Beginner', value: Difficulty.BEGINNER },
  { label: 'Intermediate', value: Difficulty.INTERMEDIATE },
  { label: 'Advanced', value: Difficulty.ADVANCED },
]

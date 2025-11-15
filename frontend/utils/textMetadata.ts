import { type BadgeVariant, Dialect, Difficulty } from '~/types'

export const difficultyToColor: Record<Difficulty, BadgeVariant> = {
  [Difficulty.BEGINNER]: 'success',
  [Difficulty.INTERMEDIATE]: 'warning',
  [Difficulty.ADVANCED]: 'error',
}

export const dialectToColor: Record<Dialect, BadgeVariant> = {
  [Dialect.TUNISIAN]: 'teal',
  [Dialect.MOROCCAN]: 'amber',
  [Dialect.EGYPTIAN]: 'blue',
  [Dialect.LEVANTINE]: 'purple',
  [Dialect.GULF]: 'pink',
  [Dialect.IRAQI]: 'red',
  [Dialect.MSA]: 'gray',
}

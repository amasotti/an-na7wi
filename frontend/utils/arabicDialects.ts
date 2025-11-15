import { Dialect } from '~/types'

export const dialectToLabel: Record<Dialect, string> = {
  [Dialect.TUNISIAN]: 'Tunisian',
  [Dialect.MOROCCAN]: 'Moroccan',
  [Dialect.EGYPTIAN]: 'Egyptian',
  [Dialect.LEVANTINE]: 'Levantine',
  [Dialect.GULF]: 'Gulf',
  [Dialect.IRAQI]: 'Iraqi',
  [Dialect.MSA]: 'MSA',
}

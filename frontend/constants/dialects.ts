import { Dialect, type SelectOption } from '~/types'

export const dialectOptions: SelectOption<Dialect>[] = [
  { label: 'Modern Standard Arabic', value: Dialect.MSA },
  { label: 'Tunisian', value: Dialect.TUNISIAN },
  { label: 'Egyptian', value: Dialect.EGYPTIAN },
  { label: 'Levantine', value: Dialect.LEVANTINE },
  { label: 'Gulf', value: Dialect.GULF },
  { label: 'Moroccan', value: Dialect.MOROCCAN },
  { label: 'Iraqi', value: Dialect.IRAQI },
]

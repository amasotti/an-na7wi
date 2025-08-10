import { MasteryLevel, type SelectOption } from '~/types'

export const masteryLevelOptions: SelectOption<MasteryLevel>[] = [
  { label: 'New', value: MasteryLevel.NEW },
  { label: 'Learning', value: MasteryLevel.LEARNING },
  { label: 'Known', value: MasteryLevel.KNOWN },
  { label: 'Mastered', value: MasteryLevel.MASTERED },
]

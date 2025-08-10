import { PartOfSpeech, type SelectOption } from '~/types'

export const partsOfSpeechOptions: SelectOption<PartOfSpeech>[] = [
  { label: 'Noun', value: PartOfSpeech.NOUN },
  { label: 'Verb', value: PartOfSpeech.VERB },
  { label: 'Adjective', value: PartOfSpeech.ADJECTIVE },
  { label: 'Adverb', value: PartOfSpeech.ADVERB },
  { label: 'Preposition', value: PartOfSpeech.PREPOSITION },
  { label: 'Pronoun', value: PartOfSpeech.PRONOUN },
  { label: 'Conjunction', value: PartOfSpeech.CONJUNCTION },
  { label: 'Interjection', value: PartOfSpeech.INTERJECTION },
  { label: 'Particle', value: PartOfSpeech.PARTICLE },
  { label: 'Unknown', value: PartOfSpeech.UNKNOWN },
]

// Enums
export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum Dialect {
  TUNISIAN = 'TUNISIAN',
  MOROCCAN = 'MOROCCAN',
  EGYPTIAN = 'EGYPTIAN',
  MSA = 'MSA'
}

export enum PartOfSpeech {
  NOUN = 'NOUN',
  VERB = 'VERB',
  ADJECTIVE = 'ADJECTIVE',
  ADVERB = 'ADVERB',
  PREPOSITION = 'PREPOSITION',
  PARTICLE = 'PARTICLE'
}

export enum AnnotationType {
  GRAMMAR = 'GRAMMAR',
  VOCABULARY = 'VOCABULARY',
  CULTURAL = 'CULTURAL',
  PRONUNCIATION = 'PRONUNCIATION'
}

// Interfaces
export interface Text {
  id: string;
  title: string;
  arabicContent: string;
  transliteration?: string;
  translation?: string;
  tags: string[];
  difficulty: Difficulty;
  dialect: Dialect;
  isPublic: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Word {
  id: string;
  arabic: string;
  transliteration?: string;
  translation?: string;
  root?: string;
  partOfSpeech?: PartOfSpeech;
  notes?: string;
  frequency: number;
  difficulty: Difficulty;
  dialect: Dialect;
  isVerified: boolean;
  createdAt: string;
}

export interface Annotation {
  id: string;
  textId: string;
  content: string;
  positionStart: number;
  positionEnd: number;
  type: AnnotationType;
  color?: string;
  createdAt: string;
}

export interface TextWord {
  textId: string;
  wordId: string;
  position: number;
  context?: string;
}

// Request/Response types
export interface TextsResponse {
  items: Text[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface TextsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  dialect?: Dialect;
  difficulty?: Difficulty;
  tags?: string[];
}

export interface WordsResponse {
  items: Word[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface WordsRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  dialect?: Dialect;
  difficulty?: Difficulty;
  partOfSpeech?: PartOfSpeech;
}

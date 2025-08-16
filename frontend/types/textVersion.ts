/**
 * Represents a summary of a text version, used in dropdowns
 */
export interface TextVersionSummary {
  id: string
  versionNumber: number
  updatedAt: string
  isCurrent: boolean
}

/**
 * Represents a text version with content
 */
export interface TextVersion extends TextVersionSummary {
  textId: string
  content: {
    title: string
    arabicContent: string
    transliteration?: string
    translation?: string
    comments?: string
  }
  createdAt: string
}

/**
 * Response from the API when fetching text versions
 */
export interface TextVersionsResponse {
  versions: TextVersionSummary[]
  currentVersionId: string
}

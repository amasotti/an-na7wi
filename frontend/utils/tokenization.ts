/**
 * Tokenizes a sentence by splitting on spaces.
 * Dashes keep sub-tokens together (e.g., "al-qara" stays as one token)
 * but are replaced with spaces in the final token.
 */
export function tokenizeBySpaces(text: string): string[] {
  return text
    .trim()
    .split(/\s+/) // Split by one or more spaces
    .map(token => token.replace(/-/g, ' ')) // Replace dashes with spaces
    .filter(token => token.length > 0)
}

/**
 * Creates word alignments from three parallel tokenized sentences
 */
export interface TokenAlignment {
  arabicTokens: string
  transliterationTokens: string
  translationTokens: string
  tokenOrder: number
}

export function createAlignments(
  arabicText: string,
  transliterationText: string,
  translationText: string
): TokenAlignment[] {
  const arabicTokens = tokenizeBySpaces(arabicText)
  const transliterationTokens = tokenizeBySpaces(transliterationText)
  const translationTokens = tokenizeBySpaces(translationText)

  // Find the maximum length to handle mismatches
  const maxLength = Math.max(
    arabicTokens.length,
    transliterationTokens.length,
    translationTokens.length
  )

  const alignments: TokenAlignment[] = []

  for (let i = 0; i < maxLength; i++) {
    alignments.push({
      arabicTokens: arabicTokens[i] || '',
      transliterationTokens: transliterationTokens[i] || '',
      translationTokens: translationTokens[i] || '',
      tokenOrder: i,
    })
  }

  return alignments
}

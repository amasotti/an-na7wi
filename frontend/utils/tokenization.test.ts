import { describe, expect, it } from 'vitest'
import { createAlignments, tokenizeBySpaces } from './tokenization'

describe('tokenizeBySpaces', () => {
  it('splits text by single spaces', () => {
    const result = tokenizeBySpaces('hello world test')
    expect(result).toEqual(['hello', 'world', 'test'])
  })

  it('splits text by multiple spaces', () => {
    const result = tokenizeBySpaces('hello   world    test')
    expect(result).toEqual(['hello', 'world', 'test'])
  })

  it('trims leading and trailing spaces', () => {
    const result = tokenizeBySpaces('  hello world  ')
    expect(result).toEqual(['hello', 'world'])
  })

  it('replaces dashes with spaces in tokens', () => {
    const result = tokenizeBySpaces('al-qara upon-you')
    expect(result).toEqual(['al qara', 'upon you'])
  })

  it('handles multiple dashes in a single token', () => {
    const result = tokenizeBySpaces('a-b-c-d')
    expect(result).toEqual(['a b c d'])
  })

  it('handles Arabic text', () => {
    const result = tokenizeBySpaces('السلام عليكم')
    expect(result).toEqual(['السلام', 'عليكم'])
  })

  it('handles Arabic with dashes', () => {
    const result = tokenizeBySpaces('زيت-زيتونة')
    expect(result).toEqual(['زيت زيتونة'])
  })

  it('returns empty array for empty string', () => {
    const result = tokenizeBySpaces('')
    expect(result).toEqual([])
  })

  it('returns empty array for whitespace-only string', () => {
    const result = tokenizeBySpaces('   ')
    expect(result).toEqual([])
  })

  it('handles single word', () => {
    const result = tokenizeBySpaces('hello')
    expect(result).toEqual(['hello'])
  })

  it('handles mixed language text', () => {
    const result = tokenizeBySpaces('السلام peace عليكم upon-you')
    expect(result).toEqual(['السلام', 'peace', 'عليكم', 'upon you'])
  })
})

describe('createAlignments', () => {
  it('creates 1:1 alignments for equal length texts', () => {
    const result = createAlignments('السلام عليكم', 'as-salamu alaykum', 'peace upon-you')

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      arabicTokens: 'السلام',
      transliterationTokens: 'as salamu',
      translationTokens: 'peace',
      tokenOrder: 0,
    })
    expect(result[1]).toEqual({
      arabicTokens: 'عليكم',
      transliterationTokens: 'alaykum',
      translationTokens: 'upon you',
      tokenOrder: 1,
    })
  })

  it('handles mismatched lengths - more Arabic tokens', () => {
    const result = createAlignments('one two three', 'un deux', 'a b')

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      arabicTokens: 'one',
      transliterationTokens: 'un',
      translationTokens: 'a',
      tokenOrder: 0,
    })
    expect(result[1]).toEqual({
      arabicTokens: 'two',
      transliterationTokens: 'deux',
      translationTokens: 'b',
      tokenOrder: 1,
    })
    expect(result[2]).toEqual({
      arabicTokens: 'three',
      transliterationTokens: '',
      translationTokens: '',
      tokenOrder: 2,
    })
  })

  it('handles mismatched lengths - more transliteration tokens', () => {
    const result = createAlignments('one', 'un deux trois', 'a')

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      arabicTokens: 'one',
      transliterationTokens: 'un',
      translationTokens: 'a',
      tokenOrder: 0,
    })
    expect(result[1]).toEqual({
      arabicTokens: '',
      transliterationTokens: 'deux',
      translationTokens: '',
      tokenOrder: 1,
    })
    expect(result[2]).toEqual({
      arabicTokens: '',
      transliterationTokens: 'trois',
      translationTokens: '',
      tokenOrder: 2,
    })
  })

  it('handles mismatched lengths - more translation tokens', () => {
    const result = createAlignments('one', 'un', 'a b c')

    expect(result).toHaveLength(3)
    expect(result[2]).toEqual({
      arabicTokens: '',
      transliterationTokens: '',
      translationTokens: 'c',
      tokenOrder: 2,
    })
  })

  it('replaces dashes with spaces in all fields', () => {
    const result = createAlignments('زيت-زيتونة', 'el-zit-zitoun', 'olive-oil')

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      arabicTokens: 'زيت زيتونة',
      transliterationTokens: 'el zit zitoun',
      translationTokens: 'olive oil',
      tokenOrder: 0,
    })
  })

  it('handles empty strings', () => {
    const result = createAlignments('', '', '')

    expect(result).toHaveLength(0)
  })

  it('handles single token in each field', () => {
    const result = createAlignments('hello', 'bonjour', 'hola')

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      arabicTokens: 'hello',
      transliterationTokens: 'bonjour',
      translationTokens: 'hola',
      tokenOrder: 0,
    })
  })

  it('preserves token order with tokenOrder field', () => {
    const result: TokenAlignment[] = createAlignments('a b c', 'd e f', 'g h i')

    expect(result).toHaveLength(3)
    expect(result[0]!.tokenOrder).toBe(0)
    expect(result[1]!.tokenOrder).toBe(1)
    expect(result[2]!.tokenOrder).toBe(2)
  })

  it('handles extra spaces in input', () => {
    const result = createAlignments('  a   b  ', '  c   d  ', '  e   f  ')

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      arabicTokens: 'a',
      transliterationTokens: 'c',
      translationTokens: 'e',
      tokenOrder: 0,
    })
    expect(result[1]).toEqual({
      arabicTokens: 'b',
      transliterationTokens: 'd',
      translationTokens: 'f',
      tokenOrder: 1,
    })
  })

  it('handles real-world example', () => {
    const result = createAlignments(
      'أنا بخير الحمد-لله',
      'ana bi-khayr al-hamdu-lillah',
      'I well praise-be-to-God'
    )

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({
      arabicTokens: 'أنا',
      transliterationTokens: 'ana',
      translationTokens: 'I',
      tokenOrder: 0,
    })
    expect(result[1]).toEqual({
      arabicTokens: 'بخير',
      transliterationTokens: 'bi khayr',
      translationTokens: 'well',
      tokenOrder: 1,
    })
    expect(result[2]).toEqual({
      arabicTokens: 'الحمد لله',
      transliterationTokens: 'al hamdu lillah',
      translationTokens: 'praise be to God',
      tokenOrder: 2,
    })
  })
})

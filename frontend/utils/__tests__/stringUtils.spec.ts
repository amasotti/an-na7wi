import { isArabicText } from '@/utils/stringUtils.ts'
import { describe, expect, it } from 'vitest'

describe('stringUtils', () => {
  it('should recognize arabic text', () => {
    const str = 'مرحبا بالعالم'
    expect(isArabicText(str)).toBe(true)
  })

  it('should recognize non-arabic text', () => {
    const str = 'Hello World'
    expect(isArabicText(str)).toBe(false)
  })

  it('should recognize mixed text with arabic', () => {
    const str = 'Hello مرحبا'
    expect(isArabicText(str)).toBe(true)
  })
})

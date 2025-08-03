import { describe, expect, it } from 'vitest'
import { isArabicText } from '../stringUtils'

describe('Basic Test Setup', () => {
  it('can run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('can test utility functions', () => {
    expect(isArabicText('كتاب')).toBe(true)
    expect(isArabicText('hello')).toBe(false)
  })
})

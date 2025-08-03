import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { CommonBaseInput as BaseInput } from '#components'

describe('BaseInput', () => {
  it('renders with a value', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: 'test' } })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('test')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('new value')
    expect(wrapper.emitted()['update:modelValue']?.[0]).toEqual(['new value'])
  })
})

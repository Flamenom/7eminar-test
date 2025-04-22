import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLoader from '~/components/AppLoader.vue'

describe('AppLoader', () => {
  it('renders with default message', () => {
    const wrapper = mount(AppLoader)
    expect(wrapper.text()).toContain('Загрузка...')
  })

  it('renders with custom message', () => {
    const wrapper = mount(AppLoader, {
      props: {
        message: 'Custom loading message'
      }
    })
    expect(wrapper.text()).toContain('Custom loading message')
  })

  it('contains spinner element', () => {
    const wrapper = mount(AppLoader)
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
  })
}) 
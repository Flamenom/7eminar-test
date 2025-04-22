import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLoader from '~/components/AppLoader.vue'

describe('AppLoader', () => {
  it('renders with default message', () => {
    const wrapper = mount(AppLoader)
    expect(wrapper.text()).toContain('Loading...')
    expect(wrapper.find('.visually-hidden').text()).toBe('Loading...')
  })

  it('renders with custom message', () => {
    const wrapper = mount(AppLoader, {
      props: {
        message: 'Custom loading message'
      }
    })
    expect(wrapper.text()).toContain('Custom loading message')
    expect(wrapper.find('.visually-hidden').text()).toBe('Loading...')
  })

  it('has correct spinner class', () => {
    const wrapper = mount(AppLoader)
    const spinner = wrapper.find('.spinner-border')
    expect(spinner.exists()).toBe(true)
    expect(spinner.classes()).toContain('text-primary')
  })
}) 
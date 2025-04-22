import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppError from '~/components/AppError.vue'

describe('AppError', () => {
  it('renders with default title and custom message', () => {
    const wrapper = mount(AppError, {
      props: {
        message: 'Test error message'
      }
    })
    expect(wrapper.text()).toContain('Произошла ошибка')
    expect(wrapper.text()).toContain('Test error message')
  })

  it('renders with custom title and message', () => {
    const wrapper = mount(AppError, {
      props: {
        title: 'Custom Error',
        message: 'Test error message'
      }
    })
    expect(wrapper.text()).toContain('Custom Error')
    expect(wrapper.text()).toContain('Test error message')
  })

  it('emits retry event when button is clicked', async () => {
    const wrapper = mount(AppError, {
      props: {
        message: 'Test error message'
      }
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('retry')
  })

  it('renders custom slot content', () => {
    const wrapper = mount(AppError, {
      props: {
        message: 'Test error message'
      },
      slots: {
        default: '<button class="custom-button">Custom Retry</button>'
      }
    })
    expect(wrapper.find('.custom-button').exists()).toBe(true)
    expect(wrapper.find('.btn-primary').exists()).toBe(false)
  })
}) 
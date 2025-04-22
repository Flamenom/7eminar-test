import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppError from '~/components/AppError.vue'

// Мокаем Bootstrap иконки
vi.mock('bootstrap-icons', () => ({
  'bi-exclamation-circle': {
    template: '<i class="bi bi-exclamation-circle"></i>'
  }
}))

describe('AppError', () => {
  it('renders with default title and custom message', () => {
    const wrapper = mount(AppError, {
      props: {
        message: 'Test error message'
      }
    })
    expect(wrapper.text()).toContain('An error occurred')
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

  it('applies correct styles', () => {
    const wrapper = mount(AppError, {
      props: {
        message: 'Test error message'
      }
    })
    const errorState = wrapper.find('.error-state')
    expect(errorState.exists()).toBe(true)
    expect(errorState.classes()).toContain('error-state')
  })
}) 
import { describe, it, expect } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import CommentForm from '~/components/CommentForm.vue'

describe('CommentForm', () => {
  let wrapper: VueWrapper

  const mountComponent = (props = {}) => {
    return mount(CommentForm, { props })
  }

  it('displays form with input fields', () => {
    wrapper = mountComponent()

    expect(wrapper.find('input#author').exists()).toBe(true)
    expect(wrapper.find('textarea#content').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('emits form data on submit', async () => {
    wrapper = mountComponent()
    const testComment = {
      author: 'Test Author',
      content: 'Test Comment Content'
    }

    await wrapper.find('input#author').setValue(testComment.author)
    await wrapper.find('textarea#content').setValue(testComment.content)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([testComment])
  })

  it('clears form after successful submission', async () => {
    wrapper = mountComponent()
    const testComment = {
      author: 'Test Author',
      content: 'Test Comment Content'
    }

    await wrapper.find('input#author').setValue(testComment.author)
    await wrapper.find('textarea#content').setValue(testComment.content)
    await wrapper.find('form').trigger('submit')

    expect((wrapper.find('input#author').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('textarea#content').element as HTMLTextAreaElement).value).toBe('')
  })

  it('shows loading state', async () => {
    wrapper = mountComponent()

    await wrapper.find('input#author').setValue('Test Author')
    await wrapper.find('textarea#content').setValue('Test Content')
    await wrapper.find('form').trigger('submit')

    const button = wrapper.find('button')
    expect(button.text()).toContain('Submitting...')
    expect(button.find('.spinner-border').exists()).toBe(true)
  })

  it('disables form when disabled prop is true', () => {
    wrapper = mountComponent({ disabled: true })

    expect(wrapper.find('input#author').attributes('disabled')).toBeDefined()
    expect(wrapper.find('textarea#content').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined()
  })
}) 
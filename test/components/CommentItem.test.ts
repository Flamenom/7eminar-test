import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentItem from '~/components/CommentItem.vue'

describe('CommentItem', () => {
  it('renders comment data correctly', () => {
    const comment = {
      id: 1,
      newsId: 1,
      author: 'John Doe',
      text: 'This is a test comment',
      date: '2024-03-20T12:00:00Z'
    }

    const wrapper = mount(CommentItem, {
      props: { comment }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('This is a test comment')
    expect(wrapper.text()).toContain('Mar 20, 2024')
  })

  it('formats date correctly', () => {
    const comment = {
      id: 1,
      newsId: 1,
      author: 'John Doe',
      text: 'This is a test comment',
      date: '2024-03-20T12:00:00Z'
    }

    const wrapper = mount(CommentItem, {
      props: { comment }
    })

    expect(wrapper.text()).toContain('Mar 20, 2024')
  })
}) 
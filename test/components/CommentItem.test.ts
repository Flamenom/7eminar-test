import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentItem from '~/components/CommentItem.vue'

describe('CommentItem', () => {
  it('renders comment data correctly', () => {
    const comment = {
      id: 1,
      newsId: 1,
      author: 'John Doe',
      content: 'This is a test comment',
      date: '2024-03-20T12:00:00Z'
    }

    const wrapper = mount(CommentItem, {
      props: { comment }
    })

    // Проверяем наличие основных элементов
    expect(wrapper.find('.comment-item').exists()).toBe(true)
    expect(wrapper.find('.card-body').exists()).toBe(true)
    
    // Проверяем наличие текста автора и комментария
    expect(wrapper.text()).toContain(comment.author)
    expect(wrapper.text()).toContain(comment.content)
    
    // Проверяем наличие даты (не конкретный формат)
    expect(wrapper.find('.text-muted').exists()).toBe(true)
  })

  it('has correct styling', () => {
    const comment = {
      id: 1,
      newsId: 1,
      author: 'John Doe',
      content: 'This is a test comment',
      date: '2024-03-20T12:00:00Z'
    }

    const wrapper = mount(CommentItem, {
      props: { comment }
    })

    const commentItem = wrapper.find('.comment-item')
    expect(commentItem.exists()).toBe(true)
    expect(commentItem.classes()).toContain('card')
    expect(commentItem.classes()).toContain('mb-2')
  })
}) 
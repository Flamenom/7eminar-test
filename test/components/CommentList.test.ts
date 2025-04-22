import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentList from '~/components/CommentList.vue'
import CommentItem from '~/components/CommentItem.vue'

describe('CommentList', () => {
  const mockComments = [
    {
      id: 1,
      newsId: 1,
      author: 'Test Author 1',
      content: 'Test Content 1',
      date: '2024-01-01'
    },
    {
      id: 2,
      newsId: 1,
      author: 'Test Author 2',
      content: 'Test Content 2',
      date: '2024-01-02'
    }
  ]

  it('displays list of comments', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: mockComments
      },
      global: {
        components: {
          CommentItem
        }
      }
    })

    const commentItems = wrapper.findAllComponents(CommentItem)
    expect(commentItems).toHaveLength(2)
    
    // Проверяем, что каждому комментарию передаются правильные пропсы
    commentItems.forEach((item, index) => {
      expect(item.props('comment')).toEqual(mockComments[index])
    })
  })

  it('displays message when there are no comments', () => {
    const wrapper = mount(CommentList, {
      props: {
        comments: []
      },
      global: {
        components: {
          CommentItem
        }
      }
    })

    expect(wrapper.findComponent(CommentItem).exists()).toBe(false)
    expect(wrapper.text()).toContain('No comments yet. Be the first to comment!')
  })
}) 
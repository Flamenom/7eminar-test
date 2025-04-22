import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsCard from '~/components/NewsCard.vue'

// Mock NuxtLink
vi.mock('#components', () => ({
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a :href="to"><slot /></a>',
    props: ['to']
  }
}))

// Mock Bootstrap icons
vi.mock('bootstrap-icons', () => ({
  'bi-calendar': {
    template: '<span class="bi bi-calendar"></span>'
  },
  'bi-arrow-right': {
    template: '<span class="bi bi-arrow-right"></span>'
  }
}))

describe('NewsCard', () => {
  const mockNews = {
    id: 1,
    title: 'Test News',
    description: 'Test Description',
    image: 'test.jpg',
    date: '2024-03-10T10:00:00Z',
    content: 'Test Content'
  }

  it('displays news data correctly', () => {
    const wrapper = mount(NewsCard, {
      props: {
        news: mockNews
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>',
            props: ['to']
          },
          'i': {
            template: '<span class="bi"></span>'
          }
        }
      }
    })

    expect(wrapper.text()).toContain(mockNews.title)
    expect(wrapper.text()).toContain(mockNews.description)
    expect(wrapper.find('img').attributes('src')).toBe(mockNews.image)
    expect(wrapper.find('img').attributes('alt')).toBe(mockNews.title)
  })

  it('has correct styling', () => {
    const wrapper = mount(NewsCard, {
      props: {
        news: mockNews
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>',
            props: ['to']
          },
          'i': {
            template: '<span class="bi"></span>'
          }
        }
      }
    })

    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).toContain('h-100')
    expect(wrapper.classes()).toContain('shadow-sm')
    expect(wrapper.classes()).toContain('news-card')
    
    const img = wrapper.find('img')
    expect(img.classes()).toContain('card-img-top')
    
    const cardBody = wrapper.find('.card-body')
    expect(cardBody.classes()).toContain('d-flex')
    expect(cardBody.classes()).toContain('flex-column')
  })

  it('has correct layout structure', () => {
    const wrapper = mount(NewsCard, {
      props: {
        news: mockNews
      },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a><slot /></a>',
            props: ['to']
          },
          'i': {
            template: '<span class="bi"></span>'
          }
        }
      }
    })

    const img = wrapper.find('img')
    const cardBody = wrapper.find('.card-body')
    const title = wrapper.find('.card-title')
    const description = wrapper.find('.card-text')
    const footer = wrapper.find('.mt-auto')
    
    expect(img.exists()).toBe(true)
    expect(cardBody.exists()).toBe(true)
    expect(title.exists()).toBe(true)
    expect(description.exists()).toBe(true)
    expect(footer.exists()).toBe(true)
  })
}) 
import { describe, it, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import NewsCard from '~/components/NewsCard.vue'

// Mock NuxtLink
vi.mock('#components', () => ({
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a :href="to"><slot /></a>',
    props: ['to']
  }
}))

// Мокаем Bootstrap иконки
vi.mock('bootstrap-icons', () => ({
  'bi-calendar': {
    template: '<i class="bi bi-calendar"></i>'
  },
  'bi-arrow-right': {
    template: '<i class="bi bi-arrow-right"></i>'
  }
}))

describe('NewsCard', () => {
  let wrapper: VueWrapper

  const mockNews = {
    id: 1,
    title: 'Test News Title',
    description: 'This is a test news description that should be truncated',
    image: 'https://example.com/test-image.jpg',
    date: '2024-03-20T12:00:00Z'
  }

  const mountComponent = () => {
    return mount(NewsCard, {
      props: { news: mockNews },
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :to="to"><slot /></a>',
            props: ['to']
          },
          'i': true // Stub Bootstrap icons
        }
      }
    })
  }

  it('displays news data correctly', () => {
    wrapper = mountComponent()

    // Check title
    const title = wrapper.find('.card-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe(mockNews.title)
    
    // Check description
    const description = wrapper.find('.card-text')
    expect(description.exists()).toBe(true)
    expect(description.text()).toBe(mockNews.description)
    
    // Check image
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockNews.image)
    expect(img.attributes('alt')).toBe(mockNews.title)
    
    // Check date
    const dateElement = wrapper.find('.mt-auto .text-muted')
    expect(dateElement.exists()).toBe(true)
    expect(dateElement.text()).toContain('March 20, 2024')
    
    // Check link
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('to')).toBe('/news/1')
    expect(link.text()).toContain('Read more')
  })

  it('has correct styling', () => {
    wrapper = mountComponent()

    // Check card classes
    const card = wrapper.find('.card')
    expect(card.exists()).toBe(true)
    expect(card.classes()).toContain('h-100')
    expect(card.classes()).toContain('shadow-sm')
    expect(card.classes()).toContain('news-card')

    // Check image styles
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.classes()).toContain('card-img-top')

    // Check text styles
    const title = wrapper.find('.card-title')
    expect(title.exists()).toBe(true)
    expect(title.classes()).toContain('text-truncate-2')
    
    const description = wrapper.find('.card-text')
    expect(description.exists()).toBe(true)
    expect(description.classes()).toContain('text-truncate-3')
    expect(description.classes()).toContain('text-muted')
  })

  it('has correct layout structure', () => {
    wrapper = mountComponent()

    // Check card structure
    const cardBody = wrapper.find('.card-body')
    expect(cardBody.exists()).toBe(true)
    expect(cardBody.classes()).toContain('d-flex')
    expect(cardBody.classes()).toContain('flex-column')

    // Check footer
    const footer = wrapper.find('.mt-auto')
    expect(footer.exists()).toBe(true)
    expect(footer.classes()).toContain('d-flex')
    expect(footer.classes()).toContain('justify-content-between')
    expect(footer.classes()).toContain('align-items-center')

    // Check button
    const button = wrapper.find('.btn')
    expect(button.exists()).toBe(true)
    expect(button.classes()).toContain('btn-primary')
    expect(button.classes()).toContain('btn-sm')
  })
}) 
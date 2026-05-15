import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import ProductCard from './ProductCard.vue'

mockNuxtImport('useI18n', () => {
  return () => ({
    locale: { value: 'en' },
    t: (key: string, count: number) => count ? `${count} pieces` : key
  })
})

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    public: { strapiUrl: 'http://localhost:1337' }
  })
})

describe('ProductCard Component', () => {
  it('emits the "add" event when the cart button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Maki Set',
        category: 'Sushi',
        pieceCount: 12,
        price: 3500
      }
    })

    const button = wrapper.find('button')
    
    await button.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('add')
    expect(wrapper.emitted('add')).toHaveLength(1)
  })
})
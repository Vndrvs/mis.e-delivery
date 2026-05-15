import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useCartStore } from './cart'

vi.stubGlobal('useCookie', () => {
  return { value: [] }
})

describe('Cart Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a new product to the cart and calculates totals correctly', () => {
    const store = useCartStore()
    
    const mockProduct = {
      id: 1,
      documentId: 'prod_123',
      name: 'Spicy Tuna Roll',
      price: 2500,
      product_type: 'sushi',
      piece_count: 8
    }

    store.addToCart(mockProduct)

    expect(store.items).toHaveLength(1)
    expect(store.items[0].quantity).toBe(1)
    expect(store.cartTotalItems).toBe(1)
    expect(store.cartTotalAmount).toBe(2500)

    store.addToCart(mockProduct)
    
    expect(store.items).toHaveLength(1)
    expect(store.items[0].quantity).toBe(2)
    expect(store.cartTotalItems).toBe(2)
    expect(store.cartTotalAmount).toBe(5000)
  })
})
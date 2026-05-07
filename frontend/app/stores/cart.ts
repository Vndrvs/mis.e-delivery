import { defineStore } from 'pinia'

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  piece_count: number;
  count: string;
}

export const useCartStore = defineStore('cart', () => {
  const items = useCookie<CartItem[]>('cart-items', { 
    default: () => [],
    watch: true 
  })

  const cartTotalAmount = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const cartTotalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  function addToCart(product: any) {
    const actualPrice = product.on_sale && product.sale_price 
      ? product.sale_price 
      : product.price;

    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: actualPrice,
        quantity: 1,
        image: product.images?.[0]?.url,
        category: product.product_type,
        piece_count: product.piece_count,
        count: product.count
      })
    }
  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter(item => item.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    cartTotalAmount,
    cartTotalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
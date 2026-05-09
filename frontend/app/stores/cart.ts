import { defineStore } from 'pinia'

export interface CartItem {
  id: number;
  documentId: string;
  name: string;
  name_accent: string;
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

    const existingItem = items.value.find(item => item.documentId === product.documentId)

    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        documentId: product.documentId,
        name: product.name,
        name_accent: product.name_accent,
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

  async function translateCart(newLocale: string) {
    if (items.value.length === 0) return;
    
    const client = useStrapiClient();

    try {
      const documentIds = items.value.map(item => item.documentId);
      
      const response = await client<any>('/products', {
        query: {
          locale: newLocale,
          'filters[documentId][$in]': documentIds
        }
      });

      response.data.forEach((translatedProduct: any) => {
        const cartItem = items.value.find(item => item.documentId === translatedProduct.documentId);
        if (cartItem) {
          cartItem.id = translatedProduct.id;
          cartItem.name = translatedProduct.name;
          cartItem.name_accent = translatedProduct.name_accent;
          
          const actualPrice = translatedProduct.on_sale && translatedProduct.sale_price 
            ? translatedProduct.sale_price 
            : translatedProduct.price;
            
          cartItem.price = actualPrice;
        }
      });

      items.value = [...items.value];
    } catch (error) {
      console.error('Failed to translate cart:', error);
    }
  }

  return {
    items,
    cartTotalAmount,
    cartTotalItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    translateCart
  }
})
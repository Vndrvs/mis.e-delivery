import { defineStore } from 'pinia'
import { computed } from 'vue'

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
      
      const queryParams: Record<string, any> = {
        locale: newLocale
      };
      documentIds.forEach((id, index) => {
        queryParams[`filters[documentId][$in][${index}]`] = id;
      });
      
      const response = await client<any>('/products', {
        query: queryParams
      });

      if (!response?.data) return;

      const freshItems = items.value.map(item => {
        const translatedProduct = response.data.find((p: any) => p.documentId === item.documentId);
        
        if (translatedProduct) {
          const actualPrice = translatedProduct.on_sale && translatedProduct.sale_price 
            ? translatedProduct.sale_price 
            : translatedProduct.price;
            
          return {
            ...item,
            id: translatedProduct.id,
            name: translatedProduct.name,
            name_accent: translatedProduct.name_accent,
            price: actualPrice,
            category: translatedProduct.product_type || item.category,
            piece_count: translatedProduct.piece_count || item.piece_count,
            count: translatedProduct.count || item.count
          };
        }
        
        return { ...item };
      });

      items.value = freshItems;

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
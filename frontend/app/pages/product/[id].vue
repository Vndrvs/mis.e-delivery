<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const client = useStrapiClient()
const cartStore = useCartStore()

const productId = route.params.id as string

const { data: productData, pending, error } = await useAsyncData<any>(
  `product-${productId}`,
  () => client(`/products/${productId}`, {
    query: {
      populate: '*',
      locale: locale.value === 'hu' ? 'hu-HU' : 'en'
    }
  }),
  { watch: [locale] }
)

const product = computed(() => productData.value?.data)
</script>

<template>
  <div class="bg-page py-10 px-4">
    
    <div v-if="pending" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="error || !product" class="text-center py-20 max-w-lg mx-auto">
      <h1 class="text-2xl font-bold text-txt-sec mb-4"> {{ t('product.notFound') }} </h1>
      <NuxtLink :to="localePath('menu')" class="bg-primary text-white px-6 py-3 rounded-full font-bold">
        {{ t('product.back') }}
      </NuxtLink>
    </div>

    <div v-else class="max-w-4xl mx-auto bg-white rounded-3xl p-6 lg:p-10 shadow-sm flex flex-col md:flex-row gap-8">
      
      <div class="w-full md:w-1/2 flex justify-center">
        <img 
          :src="product.images?.[0]?.url ? `http://46.101.159.56:1337${product.images[0].url}` : '/placeholder-food.png'" 
          :alt="product.name"
          class="w-64 h-64 md:w-full md:h-auto max-w-sm object-cover rounded-full drop-shadow-xl"
        />
      </div>

      <div class="w-full md:w-1/2 flex flex-col justify-center">
        <h1 class="text-3xl md:text-4xl font-black text-txt-sec capitalize mb-2">
          {{ product.name }} <span class="text-primary">{{ product.name_accent }}</span>
        </h1>
        
        <p class="text-txt-muted text-lg font-medium capitalize mb-6">
          {{ product.product_type }} • {{ product.piece_count }} pcs
        </p>

        <div class="text-3xl font-bold text-txt-sec mb-8">
          <span v-if="product.on_sale" class="text-primary mr-3">
            {{ product.sale_price }} {{ locale === 'hu' ? 'Ft' : 'USD' }}
          </span>
          <span :class="{'line-through text-txt-muted text-xl': product.on_sale}">
            {{ product.price }} {{ locale === 'hu' ? 'Ft' : 'USD' }}
          </span>
        </div>

        <button 
          @click="cartStore.addToCart(product)"
          class="w-full bg-txt-sec hover:bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95"
        >
          {{ t('product.cartBtn') }}
        </button>
      </div>

    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cart'

import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const route = useRoute()
const cartStore = useCartStore()
const localePath = useLocalePath()

const isStartupPage = computed(() => {
  return String(route.name || '').includes('startup')
})

watch(locale, async (newLocale, oldLocale) => {
  if (newLocale !== oldLocale && cartStore.items.length > 0) {
    await cartStore.translateCart(newLocale)
  }
})

onMounted(async () => {
  if (cartStore.items.length > 0) {
    await cartStore.translateCart(locale.value)
  }
})

const isCartPage = computed(() => {
  return String(route.name || '').startsWith('cart')
})
</script>

<template>
  <div class="layout-default" :class="{ 'allow-scroll': isStartupPage }">
    <TheNavbar />

    <main 
      class="layout-default__main bg-page" 
      :class="[!isStartupPage ? 'px-4 md:px-8' : '']"
    >
      <slot />
    </main>
    <NuxtLink
        v-if="cartStore.cartTotalItems > 0 && !isCartPage"
        :to="localePath('cart')"
        class="hidden lg:flex fixed border-2 border-white bottom-10 right-10 z-50 items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-2xl hover:scale-105 hover:rotate-6 transition-transform duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>

        <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
          {{ cartStore.cartTotalItems }}
        </span>
      </NuxtLink>
    <TheFooter class="hidden lg:display-block" />
  </div>
</template>
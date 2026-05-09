<script setup>
const { cartItemCount } = useCart() 
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isCartPage = computed(() => {
  return String(route.name || '').startsWith('cart')
})
</script>

<template>
  <div class="layout-default">
      <TheNavbar />

    <main class="layout-default__main px-4 pb-20 md:px-8 bg-page">
      <slot />
    </main>
    <NuxtLink
      v-if="cartItemCount > 0 && !isCartPage"
      to="/cart" 
      class="hidden md:flex fixed bottom-10 right-10 z-50 items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-2xl hover:scale-105 transition-transform duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>

      <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900">
        {{ cartItemCount }}
      </span>
    </NuxtLink>
    <TheFooter />
  </div>
</template>
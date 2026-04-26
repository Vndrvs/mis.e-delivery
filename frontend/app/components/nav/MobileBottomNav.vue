<script setup lang="ts">
const { navItems } = useNavMenu();
const localePath = useLocalePath();
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full z-50 md:hidden drop-shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
    <nav class="bg-primary h-[72px] flex justify-between items-center px-4 relative">
      
      <template v-for="item in navItems" :key="item.to">
        
        <NuxtLink 
          v-if="item.to !== '/cart'" 
          :to="localePath(item.to)" 
          class="nav-item"
        >
          <div class="w-6 h-6 mb-1 bg-white/20 rounded"></div> 
          <span>{{ item.name }}</span>
        </NuxtLink>

        <div v-else class="relative w-[80px] h-full flex justify-center">
          <div class="absolute -top-[24px] w-[84px] h-[84px] bg-primary rounded-full"></div>
          
          <NuxtLink 
            :to="localePath(item.to)" 
            class="absolute -top-[18px] w-[70px] h-[70px] bg-badge rounded-full flex flex-col items-center justify-center text-primary shadow-sm transition-transform active:scale-95"
          >
             <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="text-[12px] font-bold mt-0.5">{{ item.name }}</span>
          </NuxtLink>
        </div>

      </template>

    </nav>
  </div>
</template>

<style scoped lang="postcss">
.nav-item {
  @apply flex flex-col items-center justify-center w-[60px] text-txt-main opacity-90 transition-opacity;
}
.nav-item span {
  @apply text-[11px] font-medium tracking-wide mt-1;
}
.nav-item:active,
.router-link-active {
  @apply opacity-100 font-bold;
}
</style>
<script setup lang="ts">
import { getNavigation } from '~/utils/useNavigation';
const { t } = useI18n();
const localePath = useLocalePath(); 
const route = useRoute();

const navItems = computed(() => getNavigation('home', t));

const isCart = (to: string) => to === 'cart' || to === '/cart';

const isCartActive = (to: string) => {
  return route.path.includes('cart') || route.path.includes('kosar');
};
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full z-50 lg:hidden drop-shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
    <nav class="bg-primary h-[72px] flex justify-between items-center px-3 md:px-10 relative">
      
      <template v-for="item in navItems" :key="item.to">
        
        <div v-if="isCart(item.to)" class="relative w-[80px] h-full flex justify-center">
          <div class="absolute -top-[24px] w-[84px] h-[84px] bg-primary rounded-full"></div>
          
          <NuxtLink 
            :to="localePath(item.to)" 
            class="absolute -top-[18px] w-[70px] h-[70px] bg-badge rounded-full flex flex-col items-center justify-center shadow-sm transition-all active:scale-95"
            :class="{ 'nav-cart--active': isCartActive(item.to) }"
          >
            <img 
              v-if="item.icon" 
              :src="item.icon" 
              class="w-7 h-7 icon-brand" 
              :alt="item.name" 
            />
            <span class="text-[10px] font-bold mt-0.5 text-primary">{{ item.name }}</span>
          </NuxtLink>
        </div>

        <NuxtLink 
          v-else 
          :to="localePath(item.to)" 
          class="nav-item group"
          active-class="nav-item--active"
        >
          <img 
            v-if="item.icon" 
            :src="item.icon" 
            class="w-6 h-6 mb-1 icon-white transition-all" 
            :alt="item.name" 
          />
          <span class="text-[11px] font-medium tracking-wide transition-all">{{ item.name }}</span>
        </NuxtLink>

      </template>
    </nav>
  </div>
</template>

<style scoped lang="postcss">
.nav-item {
  @apply flex flex-col items-center justify-center w-[60px] text-txt-main opacity-70 transition-all;
}

.nav-item--active {
  @apply opacity-100;
}

.nav-item--active span {
  @apply font-bold scale-110;
}

.nav-item--active img {
  filter: brightness(0) invert(1) drop-shadow(0.5px 0 0 white) drop-shadow(-0.5px 0 0 white);
}

.nav-cart--active {
  @apply scale-110 shadow-lg;
}

.nav-cart--active img {
  filter: brightness(0) saturate(100%) invert(41%) sepia(92%) saturate(710%) hue-rotate(287deg) brightness(103%) contrast(97%) 
          drop-shadow(0.5px 0 0 currentColor);
}

.icon-white {
  filter: brightness(0) invert(1);
}

.icon-brand {
  filter: brightness(0) saturate(100%) invert(41%) sepia(92%) saturate(710%) hue-rotate(287deg) brightness(103%) contrast(97%);
}
</style>
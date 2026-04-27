<script setup lang="ts">
const { navItems } = useNavMenu();
const localePath = useLocalePath();

const isCart = (to: string) => to === 'cart' || to === '/cart';
</script>

<template>
  <div class="fixed bottom-0 left-0 w-full z-50 lg:hidden drop-shadow-[0_-4px_8px_rgba(0,0,0,0.08)]">
    <nav class="bg-primary h-[72px] flex justify-between items-center px-4 relative">
      
      <template v-for="item in navItems" :key="item.to">
        
        <div v-if="isCart(item.to)" class="relative w-[80px] h-full flex justify-center">
          <div class="absolute -top-[24px] w-[84px] h-[84px] bg-primary rounded-full"></div>
          
          <NuxtLink 
            :to="localePath(item.to)" 
            class="absolute -top-[18px] w-[70px] h-[70px] bg-badge rounded-full flex flex-col items-center justify-center shadow-sm transition-transform active:scale-95"
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
            class="w-6 h-6 mb-1 icon-white" 
            :alt="item.name" 
          />
          <span class="text-[11px] font-medium tracking-wide">{{ item.name }}</span>
        </NuxtLink>

      </template>
    </nav>
  </div>
</template>

<style scoped lang="postcss">
.nav-item {
	@apply flex flex-col items-center justify-center w-[60px] text-txt-main opacity-80 transition-all;
}

.nav-item--active {
	@apply opacity-100 font-bold;
}

.icon-white {
	filter: brightness(0) invert(1);
}

.icon-brand {
	filter: brightness(0) saturate(100%) invert(41%) sepia(92%) saturate(710%) hue-rotate(287deg) brightness(103%) contrast(97%);
}
</style>
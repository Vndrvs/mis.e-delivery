<script setup lang="ts">
const { navItems } = useNavMenu();
const localePath = useLocalePath();
</script>

<template>
  <nav class="navigation">
    <ul class="navigation__list">
      <li 
        v-for="item in navItems" 
        :key="item.to" 
        class="navigation__item"
      >
        <NuxtLink 
          :to="localePath(item.to)" 
          class="navigation__link"
          active-class="navigation__link--active"
        >
          <span class="navigation__text">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss">
.navigation {
  @apply w-full;
}

.navigation__list {
  @apply flex items-center justify-around md:justify-center md:gap-8 list-none p-0 m-0;
}

.navigation__item {
  @apply flex-1 md:flex-none;
}

.navigation__link {
  @apply flex flex-col items-center justify-center py-3 md:py-2 px-4 
         text-gray-600 no-underline transition-colors duration-200;
  font-family: 'Sora', sans-serif;
  letter-spacing: 0.05rem;
}

.navigation__link:hover {
  @apply text-black;
}

.navigation__link--active {
  @apply text-black font-bold;
}

.navigation__text {
  @apply text-[12px] md:text-[16px] font-medium;
}
</style>
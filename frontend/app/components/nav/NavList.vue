<script setup lang="ts">
const { navItems } = useNavMenu();
const localePath = useLocalePath();
</script>

<template>
  <nav class="navigation w-full">
    <ul class="navigation__list flex md:justify-start md:gap-8 list-none p-0 m-0">
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
          <span class="navigation__text text-">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="postcss">

.navigation__item {
  @apply flex-1 md:flex-none;
}

.navigation__link {
  @apply text-white flex flex-col items-center justify-center py-3 md:py-2 px-4 no-underline transition-colors duration-200;
}

.navigation__link:hover {
  @apply opacity-80;
}

.navigation__link--active {
  @apply font-bold;
}

.navigation__text {
  @apply text-[12px] md:text-[16px] font-medium;
}
</style>
<script setup lang="ts">
defineProps({
  navs: {
    type: Array as PropType<any[]>,
    required: true
  },
  currentPath: {
    type: String,
    default: '/'
  }
});

const localePath = useLocalePath();
</script>

<template>
  <nav class="navigation w-full px-4 justify-end">
    <ul class="navigation__list flex md:justify-end md:gap-12 list-none p-0 m-0">
      <li 
        v-for="item in navs" 
        :key="item.to" 
        class="navigation__item"
      >
        <NuxtLink 
          :to="localePath(item.to)" 
          class="navigation__link font-bold"
          active-class="navigation__link--active"
        >
          <span class="navigation__text font-bold text-white">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
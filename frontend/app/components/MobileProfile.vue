<script setup lang="ts">
defineProps<{
  displayName: string;
  navItems: any[];
}>();

const { locale } = useI18n();
const localePath = useLocalePath();

const emit = defineEmits(['logout', 'navigate']);

const handleAction = (item: any) => {
  if (item.to.includes('logout')) {
    emit('logout');
  } else {
    navigateTo(localePath(item.to));
  }
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <div>
      <h2 class="text-xl font-bold text-txt-sec text-wrap">
        {{ locale === 'hu' ? 'Üdvözlünk' : 'Welcome' }}, 
        <span class="text-primary font-medium">{{ displayName }}</span>
      </h2>
    </div>

    <nav class="flex flex-col gap-3">
      <button
        v-for="item in navItems"
        :key="item.to"
        @click="handleAction(item)"
        class="bg-white text-left px-5 py-4 rounded-2xl shadow-sm transition-all capitalize active:scale-[0.98]"
        :class="item.to.includes('logout') ? 'text-red-500 font-bold' : 'text-txt-sec font-medium'"
      >
        {{ item.name }}
      </button>
    </nav>
  </div>
</template>
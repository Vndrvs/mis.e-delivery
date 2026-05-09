<script setup lang="ts">
defineProps<{
  displayName: string;
  navItems: any[];
}>();

const { t } = useI18n();
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
    <div class="lg:ml-4 ">
      <h2 class="text-xl font-bold text-txt-sec text-wrap first-letter:capitalize">
        {{ t('profile.welcome') }}
        <span class="text-primary font-medium">{{ displayName }}</span>
      </h2>
    </div>

    <nav class="flex flex-col gap-3">
      <button
        v-for="item in navItems"
        :key="item.to"
        @click="handleAction(item)"
        class="flex flex-row items-center lg:border border-transparent lg:rounded-none border-t-white gap-3 bg-white lg:bg-transparent text-left px-4 lg:px-0 py-3 rounded-3xl shadow-sm lg:shadow-none transition-all capitalize active:scale-[0.98]"
        :class="item.to.includes('logout') ? 'text-red-500 font-bold' : 'text-txt-sec font-medium'"
      >
        <div class="w-auto h-11 border border-txt-mute lg:border-none rounded-full text-nowrap">
          <img 
            v-if="item.icon" 
            :src="item.icon" 
            class="lg:ml-4 w-11 h-11 icon-brand p-2 invert-100" 
            :alt="item.name" 
          />
        </div>
        {{ item.name }}
      </button>
    </nav>
  </div>
</template>
<template>
  <header class="w-full flex items-center justify-between py-4 px-4 md:px-8 bg-transparent">
    
    <NuxtLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
      <img src="~/assets/img/brand-logo.svg" alt="Mis.e" class="h-10 w-auto" />
    </NuxtLink>

    <div class="relative z-50">
      
      <button 
        @click="isLangMenuOpen = !isLangMenuOpen"
        class="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-black rounded-full font-sans transition-all active:scale-95 shadow-sm"
        aria-label="Change Language"
      >
        <img :src="currentFlag" class="w-6 h-4 object-cover rounded-[2px]" alt="" />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-4 h-4 transition-transform duration-200" 
          :class="isLangMenuOpen ? 'rotate-180' : ''"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="black" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <div 
        v-if="isLangMenuOpen" 
        class="absolute right-0 mt-2 w-40 bg-page border border-str-light rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2"
      >
        <button 
          @click="changeLanguage('en')"
          class="w-full flex items-center gap-3 px-4 py-3 text-sm text-txt-sec hover:bg-pill transition-colors"
          :class="{ 'font-bold bg-pill text-primary': locale === 'en' }"
        >
          <img :src="flagEn" class="w-5 h-3.5 object-cover rounded-[2px]" alt="English" />
          {{ $t('language_toggle.english') }}
        </button>

        <button 
          @click="changeLanguage('hu')"
          class="w-full flex items-center gap-3 px-4 py-3 text-sm text-txt-sec hover:bg-pill transition-colors"
          :class="{ 'font-bold bg-pill text-primary': locale === 'hu' }"
        >
          <img :src="flagHu" class="w-5 h-3.5 object-cover rounded-[2px]" alt="Magyar" />
          {{ $t('language_toggle.hungarian') }}
        </button>
      </div>
      
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

import flagEn from '~/assets/img/flag-en.svg';
import flagHu from '~/assets/img/flag-hu.svg';

type Locale = 'en' | 'hu';

const { locale, setLocale } = useI18n();
const isLangMenuOpen = ref(false);

const currentFlag = computed(() => {
  return locale.value === 'hu' ? flagHu : flagEn;
});

const changeLanguage = (newLocale: string) => {
  setLocale(newLocale as Locale);
  isLangMenuOpen.value = false;
};

const closeDropdown = (e: MouseEvent) => {
  if (!(e.target as Element).closest('.relative')) {
    isLangMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown);
});
</script>
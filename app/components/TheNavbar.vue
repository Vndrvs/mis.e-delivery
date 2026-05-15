<script setup lang="ts">
import brandLogo from "@/assets/img/brand-outline.svg";
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; //
import flagEn from '~/assets/img/flag-en.svg';
import flagHu from '~/assets/img/flag-hu.svg';

const route = useRoute();

const isStartupPage = computed(() => {
  return String(route.name || '').includes('startup')
});

type Locale = 'en' | 'hu';

const { locale, setLocale } = useI18n();
const localePath = useLocalePath();

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

const { navItems, currentPath } = useNavMenu();

const lastScrollY = ref(0);
const isVisible = ref(true);

const handleScroll = () => {
    const currentY = window.scrollY;
    isVisible.value = currentY < lastScrollY.value || currentY < 50;
    lastScrollY.value = currentY;
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
    <div>
        <NavMobileHeader class="header lg:hidden sticky w-full z-50 transition-transform duration-300" />
        <header
            class="header hidden lg:block sticky w-full z-[60] transition-transform duration-300"
            :class="{ 
                '-translate-y-full': !isVisible,
                'bg-primary shadow-md': true 
            }"
        >
            <div class="header__container mx-auto flex items-center px-6 py-3">
                
                <NuxtLink :to="localePath('index')" class="flex items-center flex-row gap-2">
                    <div class="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <img :src="brandLogo"
                            alt="Brand Logo" 
                            class="header__brand h-10 w-auto icon-black"  />
                    </div>
                    <h1 class="text-3xl font-bold text-white">Mis.e</h1>
                </NuxtLink>

                <div class="flex-grow flex">
                    <NavList
                        :navs="navItems"
                        :current-path="currentPath"
                        class="flex items-center"
                    />
                </div>

                <div class="relative flex items-center ml-4">
                    
                    <button 
                        @click.stop="isLangMenuOpen = !isLangMenuOpen"
                        class="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors border border-white/30"
                    >
                        <img :src="currentFlag" class="w-6 h-4 object-cover rounded-sm shadow-sm" alt="Language" />
                    </button>
             
                    <div 
                        v-if="isLangMenuOpen" 
                        class="absolute top-[120%] right-0 w-40 bg-page border border-str-light rounded-2xl shadow-xl overflow-hidden z-[99999]"
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
            </div>
        </header>

        <NavMobileBottomNav v-if="!isStartupPage"/>
    </div>
</template>

<style scoped lang="postcss">
.icon-white {
  filter: brightness(0) invert(1);
}

.header__brand {
	filter: brightness(0) saturate(100%) invert(41%) sepia(92%) saturate(710%) hue-rotate(287deg) brightness(103%) contrast(97%);
}
</style>
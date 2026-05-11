<script setup lang="ts">
const localePath = useLocalePath();

const setGuestMode = () => {
  const guestMode = useCookie('guest_mode', { maxAge: 60 * 60 * 24 })
  guestMode.value = 'true'
  navigateTo(localePath('index'))
}
</script>

<template>
  <main class="startup-page relative h-[84dvh] w-full flex flex-col bg-white overflow-hidden">
    <div class="startup-page__hero relative flex-grow w-full">
      <img 
        src="~/assets/img/start-background.webp"
        alt="Artisan Sushi"
        class="startup-page__image absolute inset-0 w-full h-full object-cover"
      />
      
      <div class="startup-page__hero-gradient absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      
      <div class="startup-page__status-bar absolute top-0 w-full h-12 z-10"></div>
    </div>

    <div class="startup-page__content mx-auto relative max-w-lg z-10 px-4 pb-12 pt-4 flex flex-col gap-8 bg-white">
      <header class="startup-page__header">
        <h1 class="max-w-80 startup-page__title font-sans text-primary text-[32px] font-bold leading-tight mb-3">
          {{ $t('start.title') }}
        </h1>
        
        <p class="startup-page__subtitle font-sans text-txt-muted text-base leading-relaxed font-medium">
          {{ $t('start.paragraph') }}
        </p>
      </header>

      <div class="startup-page__actions flex flex-row w-full justify-between">
        <NuxtLink 
          :to="localePath('login')"
          class="startup-page__btn startup-page__btn--primary px-3 py-2 md:px-6 rounded-full font-semibold text-sm md:text-lg transition-all bg-primary text-txt-main active:opacity-80"
        >
          {{ $t('start.btn') }}
      </NuxtLink>
        
        <button 
          @click="setGuestMode"
          type="button"
          class="startup-page__btn startup-page__btn--secondary px-3 py-2 md:px-6 rounded-full text-nowrap font-semibold text-sm md:text-lg transition-all bg-white border border-txt-muted text-txt-muted active:bg-gray-50 cursor-pointer"
        >
          {{ $t('start.guestBtn') }}
        </button>
      </div>
    </div>
    
  </main>
</template>
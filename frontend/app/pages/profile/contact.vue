<script setup lang="ts">
const { t, locale } = useI18n()
const user = useStrapiUser()

const form = reactive({
  name: user.value?.username || '',
  email: user.value?.email || ''
})
</script>

<template>
  <div class="rounded-3xl p-6 md:p-10 border border-str-light shadow-sm">
    <h1 class="text-2xl md:text-3xl font-bold text-txt-sec mb-8 capitalize">{{ t('profile.contact') }}</h1>
    
    <form class="flex flex-col gap-6 max-w-md">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-txt-sec uppercase tracking-tight">
          {{ locale === 'hu' ? 'Teljes név' : 'Full Name' }}
        </label>
        <input v-model="form.name" type="text" class="w-full px-4 py-3 rounded-xl border border-str-light bg-page focus:border-primary outline-none" />
      </div>
      
      <div class="flex flex-col gap-2">
        <label class="text-sm font-bold text-txt-sec uppercase tracking-tight">{{ t('register.email') }}</label>
        <input v-model="form.email" type="email" disabled class="w-full px-4 py-3 rounded-xl border border-str-light bg-page opacity-60 cursor-not-allowed" />
      </div>

      <button type="submit" class="bg-primary text-white font-bold px-10 py-3.5 rounded-full mt-4 shadow-lg">
        {{ locale === 'hu' ? 'Mentés' : 'Save' }}
      </button>
    </form>
  </div>
</template>
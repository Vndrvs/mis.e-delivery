<script setup lang="ts">
import { reactive, ref } from 'vue'

const { t } = useI18n()
const { login } = useStrapiAuth()
const user = useStrapiUser()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errorMessage = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''
  
  try {
    await login({ 
      identifier: form.email, 
      password: form.password 
    })
    
    router.push('/') 
  } catch (e: any) {
    errorMessage.value = e.error?.message || 'Hibás belépési adatok'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page min-h-[100dvh] w-full bg-white flex flex-col font-sans isolate" style="background-color: white !important;">
    
    <header class="login-page__header w-full bg-white py-4 flex items-center justify-center shrink-0 z-20" style="background-color: white !important;">
      <div class="flex items-center gap-2">
		<div class="flex w-12 h-12 items-center justify-center rounded-full bg-primary">
			<img 
			src="~/assets/img/brand-outline.png" 
			alt="Brand Logo" 
			class="h-10 w-auto brightness-100" 
			/>
		</div>
    
        <h1 class="text-primary text-2xl font-bold">Mis.e</h1>
      </div>
    </header>

    <div class="login-page__content flex-grow w-full bg-white px-6 py-10 max-w-lg mx-auto flex flex-col z-10" style="background-color: white !important;">
      
      <h1 class="text-3xl font-bold text-txt-sec mb-8 capitalize"> {{ $t('login.title') }} </h1>

      <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
		<div v-if="errorMessage" class="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">
			{{ errorMessage }}
		</div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-txt-sec uppercase tracking-tight">{{ $t('login.email') }}</label>
          <input 
            v-model="form.email"
            type="email" 
            :placeholder="$t('login.placeholder')"
            class="w-full px-4 py-3 rounded-xl border border-str-light bg-page focus:border-primary outline-none transition-all"
			required
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-bold text-txt-sec uppercase tracking-tight">{{ $t('login.password') }}</label>
          <input 
            v-model="form.password"
            type="password" 
            placeholder="••••••••"
            class="w-full px-4 py-3 rounded-xl border border-str-light bg-page focus:border-primary outline-none transition-all"
			required
          />
        </div>

        <button type="submit" class="w-full bg-primary text-white capitalize font-bold py-4 rounded-full mt-4 shadow-lg shadow-primary/20 transition-transform active:scale-95">
          {{ loading ? '...' : $t('login.btn') }}
        </button>
      </form>

      <footer class="mt-8 flex flex-col gap-4 text-center">
        <p class="text-txt-muted text-sm font-medium">
          {{ $t('login.forgot') }}
          <a href="#" class="text-primary underline font-bold ml-1">{{ $t('login.forgot-btn') }}</a>
        </p>
        <p class="text-txt-muted text-sm font-medium">
          {{ $t('login.register') }}
          <NuxtLink :to="$localePath('/register')" class="text-primary underline font-bold ml-1">
            {{ $t('login.register-btn') }}
          </NuxtLink>
        </p>
      </footer>
    </div>
  </div>
</template>
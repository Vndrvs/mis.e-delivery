<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { register } = useStrapiAuth()

const form = reactive({
  email: '',
  password: '',
  confirm: ''
})

const loading = ref(false)
const error = ref('')

async function onRegister() {
  loading.value = true
  error.value = ''

  if (form.password !== form.confirm) {
    error.value = t('errors.passwords_mismatch')
    loading.value = false
    return
  }
  
  try {
    await register({ 
      username: form.email,
      email: form.email, 
      password: form.password 
    })
    
    await navigateTo(localePath('menu'))

  } catch (e: any) {
    const apiError = e.error?.message || ''

    if (apiError.toLowerCase().includes('already taken')) {
      error.value = t('errors.email_taken')
    } else {
      error.value = t('errors.default_register') 
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
	<div class="register-page min-h-[100dvh] w-full flex flex-col font-sans isolate pb-16">
		<header class="register-page__header w-full bg-white py-4 flex items-center justify-center shrink-0 z-20">
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
		<div class="register-page__content flex-grow w-full md:px-6 py-10 max-w-lg mx-auto flex flex-col z-10">
			<h1 class="capitalize text-3xl font-bold text-txt-sec mb-8">{{ $t('register.title') }}</h1>
			<form class="flex flex-col gap-6" @submit.prevent="onRegister">
				<div v-if="error" class="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg">
					{{ error }}
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-sm font-bold text-txt-sec uppercase tracking-tight">{{ $t('register.email') }}</label>
					<input 
						v-model="form.email"
						type="email" 
						:placeholder="$t('register.placeholder')"
						class="w-full px-4 py-3 rounded-xl bg-white border border-str-light focus:border-primary outline-none transition-all"
						required
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-sm font-bold text-txt-sec uppercase tracking-tight">{{ $t('register.password') }}</label>
					<input 
						v-model="form.password"
						type="password" 
						placeholder="••••••••"
						class="w-full px-4 py-3 rounded-xl border border-str-light bg-white focus:border-primary outline-none transition-all"
						required
					/>
				</div>	
				<div class="flex flex-col gap-2">
					<label class="text-sm font-bold text-txt-sec uppercase tracking-tight">{{ $t('register.confirm') }}</label>
					<input 
						v-model="form.confirm"
						type="password" 
						placeholder="••••••••"
						class="w-full px-4 py-3 rounded-xl border border-str-light bg-white focus:border-primary outline-none transition-all"
						required
					/>
				</div>
				<button type="submit" class="w-full capitalize bg-primary text-white font-bold py-4 rounded-full mt-4 shadow-lg shadow-primary/20 transition-transform active:scale-95" :disabled="loading">
					{{ loading ? '...' : $t('register.btn') }}
				</button>
			</form>
			<footer class="mt-8 flex flex-col gap-4 text-center">
				<p class="text-txt-muted text-sm font-medium">
				{{ $t('register.label') }}
				<a href="#" class="text-primary underline font-bold">{{ $t('register.privacy') }}</a>
				</p>
				<p class="text-txt-muted text-sm font-medium">
				{{ $t('register.label-2') }}
				<NuxtLink :to="$localePath('register')" class="text-primary underline font-bold">
					{{ $t('register.terms') }}.
				</NuxtLink>
				
				</p>
			</footer>
		</div>
	</div>
</template>
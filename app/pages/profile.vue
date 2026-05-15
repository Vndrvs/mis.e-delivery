<script setup lang="ts">
import { getNavigation } from '~/utils/useNavigation'
import { watch, computed, ref, onMounted, reactive } from 'vue'
import mapPinIcon from '~/assets/img/profile/location-icon.svg';

const user = useStrapiUser()
const { logout } = useStrapiAuth()
const localePath = useLocalePath()
const { t, locale } = useI18n()

const client = useStrapiClient()

const route = useRoute()
const router = useRouter()

definePageMeta({
  middleware: [
    function (to, from) {
      const user = useStrapiUser()
      const localePath = useLocalePath()
      if (!user.value) {
        return navigateTo(localePath('login'))
      }
    }
  ]
})

const { data: profileResponse } = await useAsyncData<any>(
  'user-profile-direct',
  () => client('/profiles', {
    query: {
      'filters[users_permissions_user][id][$eq]': user.value?.id
    }
  })
)

const { data: userWithAddresses } = await useAsyncData<any>(
  'user-addresses-direct',
  () => client('/users/me', {
    query: {
      populate: 'addresses'
    }
  })
)

const displayName = computed(() => {
  const profile = profileResponse.value?.data?.[0]; 
  
  if (profile?.first_name && profile?.last_name) {
    return locale.value === 'hu' 
      ? `${profile.last_name} ${profile.first_name}`
      : `${profile.first_name} ${profile.last_name}`;
  }
  return user.value?.username || '';
})

const profileNavItems = computed(() => getNavigation('profile', t))

const hasZeroAddresses = computed(() => {
  const addresses = userWithAddresses.value?.addresses || [];
  return addresses.length === 0;
})

const form = reactive({
  name: displayName.value, 
  email: user.value?.email || '',
})

watch(displayName, (val) => { if (val) form.name = val }, { immediate: true })

async function handleLogout() {
  await logout()
  await navigateTo(localePath('login'))
}

const goBack = () => {
  router.push(localePath('profile'))
}

const isDesktop = ref(false)

onMounted(() => {
  const check = () => isDesktop.value = window.innerWidth >= 1024
  check()
  window.addEventListener('resize', check)
})

const isProfileRoot = computed(() => {
  return route.name?.toString().startsWith('profile___') || route.path.endsWith('/profile')
})
</script>

<template>
  <div class="profile-page min-h-[calc(100vh-100px)] bg-page pb-8 lg:pb-10 lg:pt-4 font-sans">
    <div 
      v-if="hasZeroAddresses" 
      class="text-center items-center md:text-left w-full mx-auto bg-primary mb-4 border-l-4 border-accent p-4 rounded-r-xl flex flex-col sm:flex-row justify-between md:items-start sm:items-center gap-4"
    >
      <div class="flex items-center gap-1">
        <img  
            :src="mapPinIcon"
            class="lg:ml-4 w-11 h-11 icon-brand p-2 invert"
          />
        <p class="text-txt-main font-medium min-w-80">
          {{ t('profile.noAddressParagraph') }}
        </p>
      </div>
      <NuxtLink 
        :to="localePath({ name: 'profile-addresses' })"
        class="shrink-0 bg-accent text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-pink-500 transition-colors shadow-sm"
      >
        {{ t('profile.addAddressBtn') }}
      </NuxtLink>
    </div>
    
    
    <div class="mx-auto flex flex-col lg:flex-row gap-8 lg:gap-0 lg:overflow-hidden rounded-3xl lg:border-l-0 lg:border-4 border-primary border-opacity-20">
      <MobileProfile 
        v-if="isProfileRoot"
        class="lg:hidden"
        :class="{ 'mb-12': hasZeroAddresses }"
        :display-name="displayName"
        :nav-items="profileNavItems"
        @logout="handleLogout"
      />

      <aside class="w-full hidden lg:w-64 bg-primary bg-opacity-20 shrink-0 lg:flex flex-col gap-8 py-6 min-w-[300px]">
        <MobileProfile 
          :display-name="displayName"
          :nav-items="profileNavItems"
          @logout="handleLogout"
        />
      </aside>

      <main 
        class="w-full flex-grow rounded-3xl"
        :class="{ 'hidden lg:block': isProfileRoot }"
      >
        <button 
          v-if="!isProfileRoot"
          @click="goBack"
          class="lg:hidden flex items-center gap-2 mb-6 text-txt-sec font-medium transition-transform active:scale-95"
        >
          <span class="text-xl">←</span> {{ t('profile.back') }}
        </button>

        <NuxtPage 
			class="h-full"
		/>
      </main>
      
    </div>
  </div>
</template>
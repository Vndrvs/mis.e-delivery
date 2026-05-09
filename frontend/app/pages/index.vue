<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
import { computed } from 'vue'

const user = useAppUser()
const client = useStrapiClient()

interface Address {
  id: number
  street: string
  city: string
  zip: string
  state?: string
  country?: string
  is_default?: boolean
  publishedAt?: string | null
}

interface UserWithAddresses {
  addresses: Address[]
}

const { data: userData } = await useAsyncData<UserWithAddresses | null>(
  'home-user-address',
  async () => {
    if (!user.value) return null

    return await client('/users/me', {
      query: {
        populate: 'addresses'
      }
    })
  }
)

const firstAddress = computed(() => {
  if (!userData.value?.addresses?.length) return null

  return userData.value.addresses.find(
    (addr: any) => addr.publishedAt !== null
  ) || null
})


const showVoucherBlock = computed(() => {
  if (!user.value) return true
  return !user.value.marketing_allowed
})

const isPublicGuest = computed(() => !user.value)

const subscribeToMarketing = async () => {
  try {
    console.log("Subscribing to marketing...")
  } catch (error) {
    console.error(error)
  }
}


</script>

<template>
  <div class="flex flex-col gap-6 md:pt-8 md:pb-16">
    <div
        v-if="user && firstAddress"
        class="flex flew-row items-center justify-between dark:bg-white rounded-full border border-str-light px-6 py-3"
      >
        <p class="text-md text-txt-muted first-letter:uppercase">
          {{ $t('home.delivering') }}
        </p>
        <h2 class="text-md font-bold text-txt-sec mr-4">
          {{ firstAddress.street }}
        </h2>
      </div>
    <div class="home__promotions">
      <h1 class="home__promotions-title capitalize text-3xl font-bold text-txt-sec mb-6">{{ $t('home.promotionsTitle') }}</h1>
      <PromotionalSlider class="home__promotions-slider" />
    </div>
    <div v-if="showVoucherBlock" class="dark:bg-white bg-black rounded-2xl border border-str-light p-6 flex flex-col gap-4 text-left">
    <h2 class="text-2xl font-black text-txt-sec capitalize">
      {{ $t('home.voucherTitle') }}
    </h2>
    <template v-if="isPublicGuest">
      <p class="text-txt-muted text-sm font-medium">
        {{ $t('home.voucherSignupParagraph') }}
      </p>
      <NuxtLink 
        :to="localePath('register')" 
        class="bg-primary hover:scale-105 text-white capitalize font-bold py-3 px-6 rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20 text-center mt-2 w-max"
      >
        {{ $t('home.voucherRegisterButton') }}
      </NuxtLink>
    </template>
    <template v-else>
      <p class="text-txt-muted text-sm font-medium">
        {{ $t('home.voucherParagraph') }}
      </p>
      <button 
        @click="subscribeToMarketing"
        class="bg-primary hover:scale-105 text-white capitalize font-bold py-3 px-6 rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20 w-max mt-2"
      >
        {{ $t('home.voucherSignupButton') }}
      </button>
    </template>
  </div>
  </div>
</template>
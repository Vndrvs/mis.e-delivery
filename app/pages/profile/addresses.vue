<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import mapPinIcon from '~/assets/img/profile/location-icon.svg';

const user = useStrapiUser()
const client = useStrapiClient()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: userData, pending, error, refresh } = await useAsyncData<any>(
  'user-addresses',
  () => client('/users/me', {
    query: {
      populate: 'addresses'
    }
  })
)

const addresses = computed(() => {
  const allAddresses = userData.value?.addresses || []
  return allAddresses.filter((addr: any) => addr.publishedAt !== null)
})

const deleteAddress = async (documentId: string) => {
  const isConfirmed = confirm(
    locale.value === 'hu' 
      ? 'Biztosan törölni szeretnéd ezt a címet?' 
      : 'Are you sure you want to delete this address?'
  )
  
  if (!isConfirmed) return

  try {
    await client(`/addresses/${documentId}`, {
      method: 'DELETE'
    })
    
    await refresh()
    
  } catch (err) {
    console.error('Failed to delete address:', err)
    alert(
      locale.value === 'hu' 
        ? 'Hiba történt a törlés során.' 
        : 'An error occurred while deleting the address.'
    )
  }
}

// dropdown logic
const activeDropdown = ref<number | string | null>(null)

const toggleDropdown = (id: number | string) => {
  activeDropdown.value = activeDropdown.value === id ? null : id
}

const closeDropdown = (e: MouseEvent) => {
  if (!(e.target as Element).closest('.dropdown-trigger')) {
    activeDropdown.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="addresses-container my-4 mx-4">
    <div class="flex items-center justify-between my-8 mx-8">
      <h1 class="text-2xl font-bold text-txt-black capitalize">
        {{ t('addresses.title') }}
      </h1>
      <NuxtLink 
        :to="localePath({ name: 'profile-createAddress' })"
        class="bg-accent text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity inline-block"
      >
        + {{ t('addresses.btn') }}
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-txt-sec py-4">
      {{ t('addresses.load') }}
    </div>

    <div v-else-if="error" class="bg-red-100 text-red-600 p-4 rounded-xl mb-4">
      {{ t('addresses.errorMsg') }}
    </div>

    <div v-else-if="addresses.length === 0" class="text-center bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200">
      <p class="text-txt-sec mb-4">
        {{ t('addresses.noAddress') }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 mr-4">
      <div 
        v-for="address in addresses" 
        :key="address.id"
        class="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group"
      >
        <div class="absolute top-2 right-2 dropdown-trigger z-20">
            <button 
              @click.stop="toggleDropdown(address.id)" 
              class="text-gray-800 tracking-[0.2em] font-black leading-none text-xl outline-none hover:text-primary transition-colors p-2"
            >
              ...
            </button>

            <div 
              v-if="activeDropdown === address.id" 
              class="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 z-50"
            >
              <button 
                class="block w-full px-4 py-3 text-sm text-txt-sec hover:bg-pill text-left font-medium border-b border-str-light transition-colors capitalize cursor-pointer"
              >
                {{ t('addresses.edit') }}
              </button>
              
              <button 
                @click="deleteAddress(address.documentId)" 
                class="px-4 py-3 text-sm text-red-500 hover:bg-red-50 text-left font-bold transition-colors capitalize"
              >
                {{ t('addresses.del') }}
              </button>
            </div>
          </div>
          
          <div v-if="address.is_default" class="absolute bottom-6 right-4 bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-md">
            {{ t('addresses.default') }}
          </div>

        <div class="space-y-1 text-txt-main flex flex-row items-start gap-3">
          <div class="rounded-full border border-1 border-txt-mute">
            <img  
                :src="mapPinIcon"
                class="w-11 h-11 icon-brand p-2"
              />
          </div>
          <div class="address__content flex flex-col gap-2">
            <p class="font-bold text-txt-sec">{{ address.street }}</p>
            <p class="text-txt-sec">{{ address.city }}<span v-if="address.state">, {{ address.state }}</span> {{ address.zip }}</p>
            <p class="text-txt-muted" v-if="address.country">{{ address.country }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
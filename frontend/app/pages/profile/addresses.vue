<script setup lang="ts">
import { computed } from 'vue'

const user = useStrapiUser()
const client = useStrapiClient()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: userData, pending, error } = await useAsyncData<any>(
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
</script>

<template>
  <div class="addresses-container my-4 ml-4">
    <div class="flex items-center justify-between my-8 mx-8">
      <h1 class="text-2xl font-bold text-txt-black">
        {{ locale === 'hu' ? 'Címeim' : 'My Addresses' }}
      </h1>
      <NuxtLink 
        :to="localePath({ name: 'profile-createAddress' })"
        class="bg-accent text-white px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity inline-block"
      >
        + {{ locale === 'hu' ? 'Új cím' : 'Add New' }}
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-txt-sec py-4">
      {{ locale === 'hu' ? 'Betöltés...' : 'Loading...' }}
    </div>

    <div v-else-if="error" class="bg-red-100 text-red-600 p-4 rounded-xl mb-4">
      {{ locale === 'hu' ? 'Hiba történt a címek betöltésekor.' : 'Error loading addresses.' }}
    </div>

    <div v-else-if="addresses.length === 0" class="text-center bg-white p-8 rounded-2xl border-2 border-dashed border-gray-200">
      <p class="text-txt-sec mb-4">
        {{ locale === 'hu' ? 'Még nem mentettél el címet.' : 'You have no saved addresses.' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 mr-4">
      <div 
        v-for="address in addresses" 
        :key="address.id"
        class="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group"
      >
        <div v-if="address.is_default" class="absolute top-4 right-4 bg-accent/10 text-accent text-xs font-bold px-2 py-1 rounded-md">
          {{ locale === 'hu' ? 'Alapértelmezett' : 'Default' }}
        </div>

        <div class="space-y-1 text-txt-main">
          <p class="font-bold text-txt-sec">{{ address.street }}</p>
          <p class="text-txt-sec">{{ address.city }}<span v-if="address.state">, {{ address.state }}</span> {{ address.zip }}</p>
          <p class="text-txt-sec" v-if="address.country">{{ address.country }}</p>
        </div>

        <div class="mt-6 flex gap-3">
          <button class="text-sm font-medium text-accent hover:underline">
            {{ locale === 'hu' ? 'Szerkesztés' : 'Edit' }}
          </button>
          <button class="text-sm font-medium text-red-500 hover:underline">
            {{ locale === 'hu' ? 'Törlés' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'

type StrapiUser = {
  id: number
  documentId: string
  username: string
  email: string
}

const user = useStrapiUser<StrapiUser>()
const client = useStrapiClient()
const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()

const isSubmitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  is_default: false
})

async function submitAddress() {
  if (!user.value?.id) {
    errorMessage.value = 'User not authenticated'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    await client('/addresses', {
  method: 'POST',
  body: {
    data: {
      street: form.street,
      city: form.city,
      state: form.state,
      zip: form.zip,
      country: form.country,
      is_default: form.is_default,
      users_permissions_user: {
        connect: [(user.value as any)?.documentId],
      },
    },
  },
})

    router.push(localePath({ name: 'profile-addresses' }))
  } catch (error: any) {
    console.log('FULL ERROR OBJECT:', error)

    console.log('RESPONSE STATUS:', error?.response?.status)
    console.log('RESPONSE HEADERS:', error?.response?.headers)

    console.log('RESPONSE BODY (_data):', error?.response?._data)

    errorMessage.value = t('address.error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="add-address-container max-w-2xl mx-auto my-4 ml-4">
    <div class="mb-8 mx-8">
      <h1 class="text-2xl font-bold text-txt-black">
        {{ t('address.addTitle') }}
      </h1>
    </div>

    <div v-if="errorMessage" class="bg-red-100 text-red-600 p-4 rounded-xl mb-6 mx-8">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submitAddress" class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mr-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-txt-sec mb-2">
            {{ t('address.street') }} *
          </label>
          <input 
            v-model="form.street" 
            type="text" 
            required 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-txt-sec mb-2">
            {{ t('address.city') }} *
          </label>
          <input 
            v-model="form.city" 
            type="text" 
            required 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-txt-sec mb-2">
            {{ t('address.zip') }} *
          </label>
          <input 
            v-model="form.zip" 
            type="text" 
            required 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-txt-sec mb-2">
            {{ t('address.state') }}
          </label>
          <input 
            v-model="form.state" 
            type="text" 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-txt-sec mb-2">
            {{ t('address.country') }}
          </label>
          <input 
            v-model="form.country" 
            type="text" 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div class="sm:col-span-2 flex items-center gap-3 mt-2">
          <input 
            v-model="form.is_default" 
            type="checkbox" 
            id="isDefault"
            class="w-5 h-5 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <label for="isDefault" class="text-sm font-medium text-txt-sec cursor-pointer">
            {{ t('address.isDefault') }}
          </label>
        </div>
      </div>

      <div class="mt-8 flex items-center gap-4">
        <button 
          type="submit" 
          :disabled="isSubmitting"
          class="bg-accent text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {{ isSubmitting ? t('address.saving') : t('address.save') }}
        </button>
        
        <NuxtLink 
          :to="localePath({ name: 'profile-addresses' })"
          class="text-txt-sec font-medium text-sm hover:underline"
        >
          {{ t('address.cancel') }}
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
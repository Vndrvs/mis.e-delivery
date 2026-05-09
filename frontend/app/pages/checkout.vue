<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useCartStore } from '~/stores/cart'

const user = useStrapiUser()
const client = useStrapiClient()
const { t } = useI18n()
const localePath = useLocalePath()
const cartStore = useCartStore()

const userAddresses = ref<any[]>([])

const { data: userData } = await useAsyncData<any>(
  'checkout-user-data',
  () => {
    if (!user.value) return Promise.resolve(null)
    return client('/users/me', { query: { populate: 'addresses' } })
  }
)

if (userData.value?.addresses) {
  userAddresses.value = userData.value.addresses
}

const hasSavedAddress = computed(() => userAddresses.value.length > 0)

const checkoutForm = reactive({
  lastName: '',
  firstName: '',
  email: user.value?.email || '',
  phone: '',
  zip: '',
  city: '',
  street: '',
  floorDoor: '',
  comment: '',
})

const submitOrder = async () => {
  console.log('Submitting Order...', checkoutForm)
}
</script>

<template>
  <div class="bg-page py-6 lg:py-10 font-sans pb-20 md:mb-0">
    <div class="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8">

      <main class="w-full lg:w-2/3 flex flex-col gap-4">

        <h1 class="text-3xl font-bold text-txt-sec mb-2">
          {{ t('checkout.title') }}
        </h1>

        <div 
          v-if="!user" 
          class="bg-primary/10 border border-primary text-primary p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <span class="font-medium">
            {{ t('checkout.loginPrompt') }}
          </span>
          <NuxtLink 
            :to="localePath('login')" 
            class="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform shrink-0"
          >
            {{ t('checkout.loginBtn') }}
          </NuxtLink>
        </div>

        <div v-if="!hasSavedAddress" class="bg-white rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-2 border border-str-light">
          <h2 class="text-xl font-bold text-txt-sec border-b pb-4">
            {{ t('checkout.deliveryDetails') }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.lastName') }}*</label>
              <input v-model="checkoutForm.lastName" type="text" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.firstName') }}*</label>
              <input v-model="checkoutForm.firstName" type="text" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.email') }}*</label>
              <input v-model="checkoutForm.email" type="email" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.phone') }}*</label>
              <input v-model="checkoutForm.phone" type="tel" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div class="flex flex-col gap-1 md:col-span-1">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.zipCode') }}*</label>
              <input v-model="checkoutForm.zip" type="text" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.city') }}*</label>
              <input v-model="checkoutForm.city" type="text" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.street') }}*</label>
              <input v-model="checkoutForm.street" type="text" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
            <div class="flex flex-col gap-1 md:col-span-1">
              <label class="text-sm font-medium text-txt-muted">{{ t('checkout.floorDoor') }}</label>
              <input v-model="checkoutForm.floorDoor" type="text" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div class="flex flex-col gap-1 mt-2">
            <label class="text-sm font-medium text-txt-muted">{{ t('checkout.courierNote') }}</label>
            <textarea v-model="checkoutForm.comment" rows="3" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"></textarea>
          </div>
        </div>

        <div v-else class="bg-white rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6 border border-str-light">
          <h2 class="text-xl font-bold text-txt-sec">
            {{ t('checkout.selectAddress') }}
          </h2>
          <p class="text-txt-muted">{{ t('checkout.addressPlaceholder') }}</p>
        </div>

      </main>

      <aside class="w-full lg:w-1/3">
        <div class="bg-white rounded-3xl p-6 shadow-sm sticky top-24 flex flex-col gap-6 border-2 border-txt-main">
          <h2 class="text-xl font-bold text-txt-sec border-b pb-4">
            {{ t('checkout.orderSummary') }}
          </h2>

          <div class="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2">
            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <span class="bg-page text-txt-sec font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm shrink-0">
                  {{ item.quantity }}x
                </span>
                <span class="font-medium text-txt-sec text-sm leading-tight">{{ item.name }} {{ item.name_accent }}</span>
              </div>
              <span class="font-bold shrink-0 ml-2">{{ item.price * item.quantity }} Ft</span>
            </div>
          </div>

          <div class="border-t pt-4 flex flex-col gap-2">
            <div class="flex justify-between text-txt-muted text-sm">
              <span>{{ t('checkout.totalItems') }}</span>
              <span>{{ cartStore.cartTotalItems }} {{ t('checkout.pcs') }}</span>
            </div>
            <div class="flex justify-between text-lg font-black text-txt-sec mt-2">
              <span>{{ t('checkout.total') }}</span>
              <span class="text-primary">{{ cartStore.cartTotalAmount }} Ft</span>
            </div>
          </div>

          <button
            @click="submitOrder"
            :disabled="cartStore.cartTotalItems === 0"
            class="w-full bg-txt-sec text-white py-4 rounded-full font-bold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {{ t('checkout.placeOrder') }}
          </button>
        </div>
      </aside>

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useCartStore } from '~/stores/cart'

const user = useStrapiUser()
const client = useStrapiClient()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const cartStore = useCartStore()

const isSubmitting = ref(false)
const userAddresses = ref<any[]>([])
const selectedAddressId = ref<number | null>(null)
const isSuccess = ref(false)

const { data: userData } = await useAsyncData<any>(
  'checkout-user-data',
  () => {
    if (!user.value) return Promise.resolve(null)
    return client('/users/me', { query: { populate: 'addresses' } })
  }
)

// strapi duplicates results because of some weird reason related to its drafts and published versions
// so here we filter out duplicate addresses to avoid redundant query results
if (userData.value?.addresses) {
  const uniqueAddresses = userData.value.addresses.filter((address: any, index: number, self: any[]) => {
    const addressKey = `${address.zip}-${address.city}-${address.street}`.toLowerCase().trim();
    
    return index === self.findIndex((a: any) => {
      const compareKey = `${a.zip}-${a.city}-${a.street}`.toLowerCase().trim();
      return compareKey === addressKey;
    });
  });

  userAddresses.value = uniqueAddresses;
  if (userAddresses.value.length > 0) {
    selectedAddressId.value = userAddresses.value[0].id;
  }
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

const formatPrice = (value: number | null) => {
  const val = value || 0;
  if (locale.value === 'en') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(val); 
  }
  return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(val);
};

const deliveryFee = computed(() => locale.value === 'en' ? 12.50 : 3500)
const formattedDelivery = computed(() => formatPrice(deliveryFee.value))
const formattedTotal = computed(() => formatPrice(cartStore.cartTotalAmount + deliveryFee.value))

const submitOrder = async () => {
  if (cartStore.items.length === 0) return;
  isSubmitting.value = true;

  try {
    let finalShippingAddress = {};

    if (hasSavedAddress.value && selectedAddressId.value) {
      const addr = userAddresses.value.find(a => a.id === selectedAddressId.value);
      
      const names = user.value?.username?.split(' ') || ['User', ''];
      
      finalShippingAddress = {
        first_name: names[1] || names[0],
        last_name: names.length > 1 ? names[0] : 'Customer', 
        email: user.value?.email || '',
        phone: addr.phone || '',
        zip: addr.zip,
        city: addr.city,
        street: addr.street,
        floor_door: addr.floor_door || '',
        courier_note: checkoutForm.comment || '',
      };
    } else {
      finalShippingAddress = {
        first_name: checkoutForm.firstName,
        last_name: checkoutForm.lastName,
        email: checkoutForm.email,
        phone: checkoutForm.phone,
        zip: checkoutForm.zip,
        city: checkoutForm.city,
        street: checkoutForm.street,
        floor_door: checkoutForm.floorDoor || '',
        courier_note: checkoutForm.comment || '',
      };
    }

    const payloadData: any = {
      customer_name: hasSavedAddress.value && selectedAddressId.value 
        ? (user.value?.username || 'User') 
        : `${checkoutForm.lastName} ${checkoutForm.firstName}`.trim(),
      customer_email: checkoutForm.email,
      total: cartStore.cartTotalAmount + deliveryFee.value,
      order_status: 'pending',
      shipping_address: finalShippingAddress,
      order_items: cartStore.items.map(item => ({
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    if (user.value) {
       const currentUser = user.value as any; 
       payloadData.user = currentUser.documentId || currentUser.id; 
    }

    await client('/restaurant-orders', {
      method: 'POST',
      body: { data: payloadData }
    });

    cartStore.clearCart();
    isSuccess.value = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error: any) {
    console.error('Strapi Validation Error:', error.response?._data?.error?.details?.errors || error.response?._data?.error || error);
    alert(t('checkout.errorMsg') || 'Hiba történt.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-page py-6 lg:py-10 font-sans">
    <div 
		v-if="!isSuccess"
		class="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-8"
	>

      <main class="w-full lg:w-2/3 flex flex-col gap-6">
        <h1 class="text-3xl font-bold text-txt-sec mb-2">
          {{ t('checkout.title') }}
        </h1>

        <div v-if="!user" class="bg-primary/10 border border-primary text-primary p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span class="font-medium">{{ t('checkout.loginPrompt') }}</span>
          <NuxtLink :to="localePath('login')" class="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform shrink-0">
            {{ t('checkout.loginBtn') }}
          </NuxtLink>
        </div>

        <div v-if="!hasSavedAddress" class="bg-white rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6 border border-str-light">
          <h2 class="text-xl font-bold text-txt-sec border-b pb-4">{{ t('checkout.deliveryDetails') }}</h2>
          
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
        </div>

        <div v-else class="bg-white rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6 border border-str-light">
          <h2 class="text-xl font-bold text-txt-sec">
            {{ t('checkout.selectAddress') }}
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="addr in userAddresses" 
              :key="addr.id"
              @click="selectedAddressId = addr.id"
              class="cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col gap-1"
              :class="selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-str-light hover:border-txt-muted'"
            >
              <div class="flex justify-between items-center">
                <span class="font-bold text-txt-sec">{{ addr.zip }} {{ addr.city }}</span>
                <div v-if="selectedAddressId === addr.id" class="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
              </div>
              <p class="text-sm text-txt-muted">{{ addr.street }}</p>
              <p v-if="addr.floor_door" class="text-xs text-txt-muted opacity-80">{{ addr.floor_door }}</p>
            </div>
          </div>

          <div class="flex flex-col gap-1 mt-4">
            <label class="text-sm font-medium text-txt-muted">{{ t('checkout.courierNote') }}</label>
            <textarea v-model="checkoutForm.comment" rows="2" class="bg-page border border-str-light rounded-2xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"></textarea>
          </div>
        </div>
      </main>

      <aside class="w-full lg:w-1/3">
        <div class="bg-white rounded-3xl p-6 shadow-sm sticky top-24 flex flex-col gap-6 border-2 border-txt-main">
          <h2 class="text-xl font-bold text-txt-sec border-b pb-4">{{ t('checkout.orderSummary') }}</h2>

          <div class="flex flex-col gap-4 max-h-64 overflow-y-auto pr-2">
            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <span class="bg-page text-txt-sec font-bold w-8 h-8 flex items-center justify-center rounded-full text-sm shrink-0">
                  {{ item.quantity }}x
                </span>
                <span class="font-medium text-txt-sec text-sm leading-tight">{{ item.name }}</span>
              </div>
              <span class="font-bold shrink-0 ml-2">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="border-t pt-4 flex flex-col gap-2">
            <div class="flex justify-between text-txt-muted text-sm">
              <span>{{ t('checkout.totalItems') }}</span>
              <span>{{ cartStore.cartTotalItems }} {{ t('checkout.pcs') }}</span>
            </div>
            <div class="flex justify-between text-txt-muted text-sm">
              <span>{{ locale === 'en' ? 'Delivery Fee' : 'Szállítási díj' }}</span>
              <span>{{ formattedDelivery }}</span>
            </div>
            <div class="flex justify-between text-lg font-black text-txt-sec mt-2 border-t pt-2">
              <span>{{ t('checkout.total') }}</span>
              <span class="text-primary">{{ formattedTotal }}</span>
            </div>
          </div>

          <button
            @click="submitOrder"
            :disabled="cartStore.cartTotalItems === 0 || isSubmitting"
            class="w-full bg-txt-sec text-white py-4 rounded-full font-bold text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2"
          >
            <span v-if="isSubmitting" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            {{ isSubmitting ? (locale === 'hu' ? 'Feldolgozás...' : 'Processing...') : t('checkout.placeOrder') }}
          </button>
        </div>
      </aside>
    </div>
	<div v-else class="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2 border-4 border-green-50 shadow-sm">
        <img src="~/assets/img/tick.svg" class="w-10 h-10 filter-green" alt="Success" />
      </div>
      
      <h1 class="text-3xl md:text-4xl font-black text-txt-sec">
        {{ t('checkout.successStatus') }}
      </h1>
      
      <p class="text-txt-muted text-lg mt-2 mb-4">
        {{ t('checkout.successMessage') }}
      </p>

      <NuxtLink 
        :to="localePath('menu')" 
        class="bg-txt-sec text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black hover:scale-105 transition-all shadow-md"
      >
        {{ t('checkout.backToMenu') }}
      </NuxtLink>
    </div>
  </div>
</template>
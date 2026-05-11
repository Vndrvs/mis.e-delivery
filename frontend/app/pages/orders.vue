<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '~/stores/cart'
import mapPinIcon from '~/assets/img/profile/location-icon.svg';

const localePath = useLocalePath()
const { t, locale } = useI18n()
const cartStore = useCartStore()

const client = useStrapiClient()
const user = useStrapiUser()

const formatOrderPrice = (amount: number, currency: string) => {
  if (!currency || currency === 'HUF') {
    return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(amount);
  }
  
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);
  }
  
  return `${amount} ${currency}`;
};

const formatOrderDateTime = (dateString: string) => {
  if (!dateString) return { date: '', time: '' };
  const date = new Date(dateString);
  
  const targetLocale = locale.value === 'en' ? 'en-US' : 'hu-HU';

  const datePart = new Intl.DateTimeFormat(targetLocale, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }).format(date);

  const timePart = new Intl.DateTimeFormat(targetLocale, { 
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

  return { date: datePart, time: timePart };
};

const { data: ordersData, pending, error } = await useAsyncData<any>(
  'user-orders',
  () => {
    if (!user.value) return Promise.resolve(null)

    return client('/restaurant-orders', {
      query: {
        'filters[user][id][$eq]': user.value.id, 
        
        'populate[0]': 'order_items',
        'populate[1]': 'shipping_address',
        'sort[0]': 'createdAt:desc'
      }
    })
  },
  {
    watch: [user] 
  }
)

const myOrders = computed(() => ordersData.value?.data || [])

// dropdown for orders
const downloadInvoice = () => {
  alert(locale.value === 'hu' ? 'Számla letöltése folyamatban...' : 'Downloading invoice...');
}

const activeDropdown = ref<string | null>(null)

const toggleDropdown = (id: string) => {
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

// copy order
const isCopying = ref(false)

const copyOrder = async (order: any) => {
  isCopying.value = true;
  
  try {
    const { data: currentMenuData } = await client<any>('/products', {
      query: { populate: '*' }
    });
    
    const liveProducts = currentMenuData || [];
    
    cartStore.clearCart();

    for (const pastItem of order.order_items) {
      const liveProduct = liveProducts.find((p: any) => 
        p.name.toLowerCase() === pastItem.product_name.toLowerCase()
      );

      if (liveProduct) {
        for (let i = 0; i < pastItem.quantity; i++) {
          cartStore.addToCart(liveProduct);
        }
      } else {
        console.warn(`Product ${pastItem.product_name} is no longer available.`);
      }
    }

    await navigateTo(localePath('checkout'));
    
  } catch (error) {
    console.error('Failed to copy order:', error);
    alert(locale.value === 'hu' ? 'Hiba történt a rendelés másolása közben.' : 'Failed to copy order.');
  } finally {
    isCopying.value = false;
  }
}
</script>

<template>
  <div>
	<div v-if="!user" class="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-6 px-4 min-h-[calc(100dvh-160px)]">
      <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
        <img src="~/assets/img/user-icon.svg" class="w-10 h-10 opacity-50" alt="Login Required" />
      </div>
      <h2 class="text-2xl md:text-3xl font-black text-txt-sec"> {{ t('orders.prompt') }} </h2>
      <p class="first-letter:capitalize text-txt-muted text-lg max-w-md"> {{ t('orders.warn') }} </p>
      <NuxtLink 
        :to="localePath('login')" 
        class="mt-4 bg-txt-sec text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all shadow-md active:scale-95"
      >
        {{ t('orders.redirect') }}
      </NuxtLink>
    </div>

    <div v-if="pending"> {{ t('orders.load') }} </div>
        
    <div v-else class="flex flex-col mb-8 gap-4 lg:pt-10">
		<div v-for="order in myOrders" :key="order.documentId" class="border p-4 rounded-3xl dark:bg-white flex flex-row items-stretch justify-between gap-2 relative shadow-sm">		<div class="order__item-content flex flex-col">
			<div class="flex flex-row gap-2">
				<span class="font-bold text-txt-sec">
					{{ formatOrderDateTime(order.createdAt).date }}
				</span>
				<span class="text-txt-muted font-bold">
					{{ formatOrderDateTime(order.createdAt).time }}
				</span>
			</div>
			<span class="font-bold">{{ order.shipping_address.street }}</span>
			<div class="text-sm capitalize"> {{ t('orders.status') }}: {{ order.order_status }}</div>
				<ul class="text-sm text-gray-500">
				<li v-for="item in order.order_items" :key="item.id">
					{{ item.quantity }}x {{ item.product_name }} - {{ item.price }} Ft
				</li>
				</ul>
				<span class="text-primary font-bold">{{ formatOrderPrice(order.total, order.currency) }}</span>
			</div>
			<div class="order__item-btn flex flex-col items-end justify-between">
				<div class="relative dropdown-trigger z-20">
					<button 
						@click.stop="toggleDropdown(order.documentId)" 
						class="text-gray-800 tracking-[0.2em] font-black leading-none text-xl outline-none hover:text-primary transition-colors"
					>
						...
					</button>
				<div 
                    v-if="activeDropdown === order.documentId" 
                    class="absolute top-10 right-0 mt-1 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 z-50"
                >
					<button 
						@click="activeDropdown = null; downloadInvoice()" 
						class="px-4 py-3 text-sm text-txt-sec hover:bg-pill text-left font-medium border-b border-str-light transition-colors capitalize"
					>
						{{ locale === 'hu' ? 'Számla letöltése' : 'Download Invoice' }}
					</button>
				
					<NuxtLink 
						:to="localePath('contact')" 
						@click="activeDropdown = null"
						class="px-4 py-3 text-sm text-txt-sec hover:bg-pill text-left font-medium transition-colors capitalize cursor-pointer"
					>
						{{ locale === 'hu' ? 'Kapcsolatfelvétel' : 'Talk to Support' }}
					</NuxtLink>
				</div>
			</div>
				<button 
					@click="copyOrder(order)" 
              		:disabled="isCopying"
					class="w-full bg-primary text-white capitalize font-bold py-2 px-4 rounded-full mt-4 shadow-lg shadow-primary/20 transition-transform active:scale-95"
				>
					<span v-if="isCopying" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full shrink-0"></span>
					{{ $t('orders.btn') }}
				</button>
			</div>
      	</div>
    </div>
  </div>
  <div class="h-12 w-full lg:h-1 shrink-0"></div>
</template>
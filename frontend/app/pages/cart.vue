<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const user = useStrapiUser()
const localePath = useLocalePath()
const { t, locale } = useI18n()
const config = useRuntimeConfig()

watch(locale, (newLocale, oldLocale) => {
  if (newLocale !== oldLocale && cartStore.items.length > 0) {
    cartStore.clearCart()
  }
})

const deliveryFee = computed(() => {
  return locale.value === 'en' ? 12.50 : 3500;
})

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/placeholder-food.png'
  if (imagePath.startsWith('http')) return imagePath
  const strapiUrl = config.public.strapi?.url || 'http://46.101.159.56:1337'
  return `${strapiUrl}${imagePath}`
}

const getDisplayCategory = (category: string) => {
  if (!category) return '';
  const raw = category.toLowerCase();

  if (raw === 'vegan') return 'sushi';
  if (locale.value === 'hu') return t(`categories.${raw}`);

  return raw;
};

const formatPrice = (value: number | null) => {
  const val = value || 0;

  if (locale.value === 'en') {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 2 
    }).format(val); 
  }

  return new Intl.NumberFormat('hu-HU', { 
    style: 'currency', 
    currency: 'HUF', 
    maximumFractionDigits: 0 
  }).format(val);
};

const formattedSubtotal = computed(() => formatPrice(cartStore.cartTotalAmount))
const formattedDelivery = computed(() => formatPrice(deliveryFee.value))
const formattedTotal = computed(() => formatPrice(cartStore.cartTotalAmount + deliveryFee.value))
</script>

<template>
	<div class="bg-[#EFEFEF] min-h-[calc(100vh-80px)] py-6 md:py-10 px-4 font-sans">
		<div v-if="cartStore.items.length === 0" class="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm">
			<p class="text-txt-muted font-medium mb-6"> {{ t('cart.empty') }} </p>
			<NuxtLink :to="localePath('menu')" class="bg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-pink-500 transition-colors">
				{{ t('cart.back-btn') }}
			</NuxtLink>
		</div>
		<div v-else class="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10">
			<div class="w-full lg:flex-grow flex flex-col gap-4">
				<div 
				v-for="item in cartStore.items" 
				:key="item.id"
				class="bg-white rounded-3xl p-4 md:p-5 flex items-center gap-4 md:gap-6 shadow-sm relative"
				>
					<img 
						:src="getImageUrl(item.image)"
						class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-full bg-gray-50 shrink-0 drop-shadow-md" 
						:alt="item.name" 
					/>

					<div class="flex-grow flex flex-col justify-between min-h-[5.5rem]">
						<div>
							<button @click="cartStore.removeFromCart(item.id)" class="absolute top-5 right-5 text-gray-800 tracking-[0.2em] font-black leading-none text-xl outline-none hover:text-red-500 transition-colors">
								...
							</button>
						
							<h3 class="font-bold text-[1.1rem] md:text-xl text-gray-900 leading-tight capitalize">
								{{ item.name }} 
								<span class="text-primary">{{ getDisplayCategory(item.category) }}</span>
							</h3>
						
							<p class="text-sm text-gray-600 mt-0.5 font-mono">
								{{ item.piece_count || 1 }} {{ t('products.count', item.piece_count || 1) }} / {{ t('products.item') }}
							</p>
						</div>

						<div class="flex items-end justify-between mt-3">
							<span class="font-bold text-[1.1rem] md:text-xl text-gray-900">
								{{ formatPrice(item.price * item.quantity) }}
							</span>

							<div class="flex items-center bg-pill rounded-full p-1 shadow-inner">
								<button 
								@click="cartStore.updateQuantity(item.id, item.quantity - 1)" 
								class="w-8 h-8 flex items-center justify-center bg-white rounded-full border border-gray-300 text-gray-800 transition-transform active:scale-95"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4"></path></svg>
								</button>
								
								<span class="font-bold text-gray-900 w-8 text-center text-lg">
									{{ item.quantity }}
								</span>
					
								<button 
									@click="cartStore.updateQuantity(item.id, item.quantity + 1)" 
									class="w-8 h-8 flex items-center justify-center bg-primary rounded-full text-white shadow-md transition-transform active:scale-95"
								>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full lg:w-[380px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
				<div class="flex gap-3">
					<input 
						type="text" 
						:placeholder="t('cart.promotion')"
						class="flex-grow bg-white rounded-2xl px-5 py-4 text-gray-700 capitalize shadow-sm outline-none focus:ring-2 focus:ring-primary" 
					/>
					<button class="bg-primary text-white capitalize font-bold rounded-2xl px-8 py-4 shadow-sm hover:bg-pink-500 transition-colors active:scale-95">
						{{ t('cart.promo-btn') }}
					</button>
				</div>
				<div class="bg-[#F6C6E4] rounded-3xl p-6 shadow-sm flex flex-col gap-2">
					<div class="flex justify-between items-center text-gray-900 text-lg mb-3">
						<span class="capitalize">{{ t('cart.subtotal') }}</span>
						<span>{{ formattedSubtotal }}</span>
					</div>
					<div class="flex justify-between items-center text-gray-900 text-lg">
						<span class="capitalize">{{ t('cart.delivery') }}</span>
						<span>{{ formattedDelivery }}</span>
					</div>
					<hr class="border border-black/10 my-3">
					<div class="flex justify-between items-center text-black font-extrabold text-xl">
						<span class="capitalize">{{ t('cart.total') }}</span>
						<span>{{ formattedTotal }}</span>
					</div>
				</div>
				<button class="w-full bg-accent text-white capitalize font-bold text-lg py-4 rounded-full shadow-lg hover:bg-pink-500 transition-transform active:scale-95">
					{{ t('cart.btn') }}
				</button>
			</div>
		</div>
	</div>
</template>
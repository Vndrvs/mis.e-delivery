<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { watch, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// diplaying items in cart
const cartStore = useCartStore()
const localePath = useLocalePath()
const { t, locale } = useI18n()
const config = useRuntimeConfig()

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

watch(locale, async (newLocale, oldLocale) => {
  if (newLocale !== oldLocale && cartStore.items.length > 0) {
    await cartStore.translateCart(newLocale)
  }
})

const formattedSubtotal = computed(() => formatPrice(cartStore.cartTotalAmount))
const formattedDelivery = computed(() => formatPrice(deliveryFee.value))
const formattedTotal = computed(() => formatPrice(cartStore.cartTotalAmount + deliveryFee.value))

// dropdown for cart items

const activeDropdown = ref<number | null>(null)

const toggleDropdown = (id: number) => {
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
	<div class="flex flex-col items-center justify-center pt-4 lg:py-16 md:py-24 text-center md:px-4">
		<div v-if="cartStore.items.length === 0" class="flex flex-col items-center max-w-4xl mx-auto text-center py-20 gap-6 rounded-3xl shadow-sm min-h-[calc(100dvh-200px)]">
			<div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2">
				<img src="~/assets/img/cart-icon.svg" class="w-10 h-10 opacity-50" alt="Login Required" />
			</div>
			<h2 class="text-2xl md:text-3xl font-black text-txt-sec first-letter:capitalize"> {{ t('cart.empty') }} </h2>
			<p class="text-txt-muted font-medium mb-6 first-letter:capitalize"> {{ t('cart.emptyWarn') }} </p>
			<NuxtLink 
				:to="localePath('menu')" 
				class="bg-txt-sec text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-all shadow-md active:scale-95">
				{{ t('cart.back-btn') }}
			</NuxtLink>
		</div>
		<div v-else class="w-full flex flex-col lg:flex-row gap-6 lg:gap-10 min-h-[calc(100dvh-200px)] mb-28 lg:mb-0">
			<div class="lg:flex-grow flex flex-col gap-4">
				<div 
				v-for="item in cartStore.items" 
				:key="item.id"
				class="lg:min-w-[540px] bg-white rounded-3xl p-4 md:p-5 flex items-center gap-4 md:gap-6 shadow-sm relative"
				>
					<img 
						:src="getImageUrl(item.image)"
						class="w-24 h-24 md:w-28 md:h-28 object-cover rounded-full bg-gray-50 shrink-0 drop-shadow-md" 
						:alt="item.name" 
					/>

					<div class="flex-grow flex flex-col items-start justify-between min-h-[5.5rem]">
						<div>
							<div class="absolute top-2 right-2 md:top-0 md:right-0 dropdown-trigger z-20">
								<button 
									@click.stop="toggleDropdown(item.id)" 
									class="text-gray-800 tracking-[0.2em] font-black leading-none text-xl outline-none hover:text-primary transition-colors p-2"
								>
									...
								</button>

                            <div 
                                v-if="activeDropdown === item.id" 
                                class="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 z-50"
                            >
                                <NuxtLink 
                                    :to="localePath(`/product/${item.documentId || item.id}`)" 
                                    @click="activeDropdown = null"
                                    class="block w-full px-4 py-3 text-sm text-txt-sec hover:bg-pill text-left font-medium border-b border-str-light transition-colors capitalize cursor-pointer"
                                >
                                    {{ t('cart.viewProduct') || 'View Product' }}
                                </NuxtLink>
                                
                                <button 
                                    @click="cartStore.removeFromCart(item.id); activeDropdown = null" 
                                    class="px-4 py-3 text-sm text-red-500 hover:bg-red-50 text-left font-bold transition-colors capitalize"
                                >
                                    {{ t('cart.remove') || 'Remove' }}
                                </button>
                            </div>
                        </div>
						<div class="flex flex-col items-start">
							<h3 class="font-bold text-[1.1rem] md:text-xl text-gray-900 leading-tight capitalize">
								{{ item.name }} <span class="text-primary"> {{ item.name_accent }} </span>
								<span class="text-primary"> {{ getDisplayCategory(item.category) }} </span>
							</h3>
						
							<p class="text-sm text-gray-600 mt-0.5 font-mono">
								{{ item.piece_count || 1 }} {{ t('products.count', item.piece_count || 1) }} / {{ t('products.item') }}
							</p>
						</div>
					</div>

						<div class="w-full flex items-end justify-between mt-3">
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
				<div class="flex gap-3 overflow-hidde justify-between">
					<input 
						type="text" 
						:placeholder="t('cart.promotion')"
						class="max-w-[180px] md:max-w-full flex-grow bg-white rounded-2xl px-5 py-3 md:py-4 text-gray-700 capitalize shadow-sm outline-none focus:ring-2 focus:ring-primary" 
					/>
					<button class="bg-primary text-white capitalize font-bold rounded-2xl px-5 md:px-8 py-3 md:py-4 shadow-sm hover:bg-pink-500 transition-colors active:scale-95">
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
				<NuxtLink 
				:to="localePath('checkout')"
				class="block text-center w-full bg-accent text-white capitalize font-bold text-lg py-4 rounded-full shadow-lg hover:bg-pink-500 transition-transform active:scale-95"
				>
				{{ t('cart.btn') }}
				</NuxtLink>
			</div>
		</div>
	</div>
</template>
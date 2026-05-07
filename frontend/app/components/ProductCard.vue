<script setup lang="ts">
import { computed } from 'vue';
const { locale, t } = useI18n();

const props = defineProps<{
  title: string;
  category: string;
  pieceCount: number;
  price: number;
  onSale?: boolean;
  salePrice?: number | null;
  image?: string;
}>();

const config = useRuntimeConfig();

const displayCategory = computed(() => {
  const raw = props.category.toLowerCase();

  if (raw === 'vegan') {
    return 'sushi';
  }

  if (locale.value === 'hu') {
    return t(`categories.${raw}`);
  }

  return raw;
});

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

const fullImageUrl = computed(() => {
	if (!props.image) return '';
	return props.image.startsWith('/') 
	? `${config.public.strapiUrl}${props.image}` 
	: props.image;
});

const emit = defineEmits(['add'])

</script>

<template>
	<div class="bg-black dark:bg-white rounded-2xl border border-str-light overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 relative min-h-[340px]">
		<div 
			v-if="fullImageUrl"
			class="absolute inset-x-0 bottom-0 h-1/2 z-0 pointer-events-none overflow-hidden"
		>
			<img
				:src="fullImageUrl"
				class="absolute -bottom-40 left-1/2 -translate-x-1/2 scale-[2.5] origin-bottom object-contain w-full h-full opacity-20"
				aria-hidden="true"
			/>
			
			<div class="absolute -bottom-0 inset-0 bg-gradient-to-t from-transparent via-white/0 to-black dark:to-white"></div>
		</div>
	
		<div class="relative z-10 flex flex-col h-full flex-grow">
			<div class="px-4 pt-4 pb-2">
				<h3 class="text-xl font-black text-txt-sec leading-tight capitalize">
					{{ title }}
					<span class="text-primary ml-1"> {{ displayCategory }} </span>
				</h3>
				<span class="text-sm font-mono text-txt-sec opacity-80">
					{{ pieceCount }} {{ t('products.count', pieceCount) }}
				</span>
			</div>
			<div class="flex-grow flex items-center justify-center px-2">
				<div class="w-full h-44 sm:w-52 sm:h-52 relative">
					<img
						v-if="fullImageUrl"
						:src="fullImageUrl"
						:alt="title"
						class="object-contain w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
					/>
				</div>
			</div>
			<div class="p-5 flex justify-between items-end">
				<div class="bg-white dark:bg-black text-page px-4 py-2 rounded-full border border-str-light shadow-sm flex flex-col items-start leading-none">
					<span v-if="onSale" class="text-[10px] text-txt-muted line-through mb-1">
					{{ formatPrice(price) }}
					</span>
					<span class="text-sm font-bold">
					{{ formatPrice(onSale ? salePrice ?? price : price) }}
					</span>
				</div>
				
				<button 
					class="bg-primary hover:scale-105 text-white p-3 rounded-full transition-all active:scale-95 shadow-lg shadow-primary/20"
					@click="emit('add')"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const { locale, t } = useI18n();

const props = defineProps<{
  name: string
  name_accent?: string
  description?: string
  price: number
  sale_price?: number | null
  valid_until?: string
  images?: Array<{ url: string }>
}>()

const config = useRuntimeConfig();

const formatPrice = (value: number | null | undefined) => {
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
  const image = props.images?.[0]?.url;

  if (!image) return '';

  return image.startsWith('/')
    ? `${config.public.strapiUrl}${image}`
    : image;
});

const emit = defineEmits(['add'])

</script>

<template>
    <div class="bg-secondary rounded-2xl border border-str-light overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 relative text-left">
        <div class="relative flex flex-col h-full gap-0">
            <div class="px-4 pt-4">
                <h3 class="text-xl font-black text-txt-sec leading-tight capitalize">
                    {{ name }}
                    <span class="text-white ml-1"> {{ name_accent }} </span>
                </h3>
				<p class="txt-white dark:txt-black">
					{{ description }}
				</p>
            </div>
            <div class="w-full flex px-2">
                <div class="w-full h-[200px] shrink-0 relative px-2">
                    <img
                        v-show="fullImageUrl"
                        :src="fullImageUrl"
                        :alt="name"
                        class="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
                    />
                </div>
            </div>
            <div class="px-5 pb-5 flex justify-between items-end">
                <div class="bg-white dark:bg-black text-page px-4 py-2 rounded-full border border-str-light shadow-sm flex flex-col items-start leading-none">
                    <span class="text-[10px] text-txt-muted line-through mb-1">
                    {{ formatPrice(price) }}
                    </span>
                    <span class="text-sm font-bold">
                    {{ formatPrice(sale_price) }}
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
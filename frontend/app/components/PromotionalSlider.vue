<script setup lang="ts">
import type { Ref } from "vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import emblaCarouselVue from "embla-carousel-vue";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useCartStore } from '~/stores/cart'

const { find } = useStrapi();
const { locale, t } = useI18n();
const strapiLocale = computed(() => locale.value === 'hu' ? 'hu-HU' : 'en');
const cartStore = useCartStore();
const config = useRuntimeConfig();

interface StrapiProduct {
  id: number;
  name: string;
  name_accent: string;
  product_type: string;
  description: string;
  is_promotion?: boolean;
  valid_until?: string;
  is_maki: boolean;
  piece_count: number;
  on_sale: boolean;
  price: number;
  sale_price?: number | null;
  createdAt: string;
  images?: Array<{ url: string }>;
}

const { data: products, pending } = await useAsyncData(
  'promotion-products',
  () => find('products', {
    populate: '*',
    locale: strapiLocale.value,
    filters: {
      is_promotion: {
        $eq: true
      }
    } as any
  }) as unknown as Promise<{ data: StrapiProduct[] }>,
  {
    watch: [strapiLocale]
  }
)

const richTextToPlain = (blocks: any): string => {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .flatMap(block => block.children || [])
    .map(child => child.text || '')
    .join(' ')
}

const normalizedProducts = computed(() =>

  (products.value?.data || []).map((product: any) => ({

    ...product,

    description: richTextToPlain(product.description)

  }))

)

const options: Partial<EmblaOptionsType> = { loop: true, align: "start" };

const [emblaRef, emblaApi] = emblaCarouselVue(
	options,
	[WheelGesturesPlugin()],
) as [Ref<HTMLElement | undefined>, Ref<EmblaCarouselType | undefined>];

const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const selectedIndex = ref(0);
const scrollSnaps = ref<number[]>([]);

const scrollTo = (index: number) => {
	emblaApi.value?.scrollTo(index);
};

const updateCarouselState = () => {
	if (!emblaApi.value) return;

	selectedIndex.value = emblaApi.value.selectedScrollSnap();

	scrollSnaps.value = emblaApi.value.scrollSnapList();

	canScrollPrev.value = emblaApi.value.canScrollPrev();
	canScrollNext.value = emblaApi.value.canScrollNext();
};

onMounted(() => {
	if (!emblaApi.value) return;

	updateCarouselState();

	emblaApi.value.on("select", updateCarouselState);
	emblaApi.value.on("reInit", updateCarouselState);
});

onUnmounted(() => {
	if (!emblaApi.value) return;
	emblaApi.value.off("select", updateCarouselState);
	emblaApi.value.off("reInit", updateCarouselState);
});
</script>

<template>
    <div class="text-center bg-cover">
        <div class="embla-testimonial-wrapper">
            <div ref="emblaRef" class="overflow-hidden">
                <div class="flex">  
                    <div 
                        class="flex-none snap-start mr-[1.2rem] md:mr-[3rem] w-[65%] md:w-[400px]"
                        v-for="product in normalizedProducts"
                        :key="product.id"
                    >
                        <PromotionCard
                            class="flex flex-grow-0 h-full"
                            :name="product.name"
                            :name_accent="product.name_accent"
                            :description="product.description"
                            :price="product.price"
                            :sale_price="product.sale_price"
                            :valid_until="product.valid_until"
                            :images="product.images"
                            @add="cartStore.addToCart(product)"
                        />
                    </div>
                </div>
            </div>
            <div class="flex justify-center items-center mt-8">
                <button
                    v-for="(snap, index) in scrollSnaps"
                    :key="index"
                    class="rounded-[2px] w-12 h-[0.4rem] p-0 mx-2 cursor-pointer transition-colors duration-200 ease-in-out bg-str-light border border-txt-muted"
                    :class="[
                        index === selectedIndex 
                            ? 'bg-txt-muted' 
                            : 'bg-str-light hover:bg-primary'
                    ]"
                    @click="scrollTo(index)"
                />
            </div>
        </div>
    </div>
</template>

<style lang="postcss" scoped>

.embla {
    overflow: hidden;
}

.embla__container {
    display: flex;
}

.embla__slide {
    flex: 0 0 auto;
    min-width: 0; 
    width: 85%; 
    margin-right: 1rem; 
}

.embla {

	@include breakpoint(medium) {
		padding-left: 3rem;
	}

	&__container {
		display: flex;
	}

	&__slide {
		flex: 0 0 auto;
		scroll-snap-align: start;
		margin-right: 1.2rem;

		@include breakpoint(medium) {
			margin-right: 3rem;
		}
	}

	&__controls {
		display: none;
	}

	&__dots {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 2rem;
	}

	&__dot {
		background-color: var(--bg-primary);
		border-radius: 2px;
		width: 3rem;
		height: 0.4rem;
		border: 0;
		padding: 0;
		margin: 0 $space-s;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	&__dot:hover {
		background-color: #9ca3af;
	}

	&__dot--selected {
		background-color: var(--color-highlight);
	}
}

@media (min-width: 768px) {
    .embla__slide {
        width: 400px;
        margin-right: 1.5rem;
    }
}
</style>
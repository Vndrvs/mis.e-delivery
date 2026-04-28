<script setup lang="ts">
const { find } = useStrapi();
const { locale } = useI18n();
const strapiLocale = computed(() => locale.value === 'hu' ? 'hu-HU' : 'en');

const config = useRuntimeConfig();

const ALL = 'all';
const currentCategory = ref(ALL);
const saleOnly = ref(false);
const makiOnly = ref(false);
const bowlOnly = ref(false);
const veganOnly = ref(false);
const sortType = ref<'price_low' | 'price_high' | 'newest' | 'category' | null>(null);

interface StrapiProduct {
  id: number;
  name: string;
  product_type: string;
  piece_count: number;
  on_sale: boolean;
  price: number;
  sale_price?: number | null;
  createdAt: string;
  images?: Array<{ url: string }>;
}

const { data: products, pending } = await useAsyncData(
  'products-list',
  () => find('products', { 
    populate: '*',
    locale: strapiLocale.value 
  }) as unknown as Promise<{ data: StrapiProduct[] }>, // <-- Added "as unknown" here
  { 
    watch: [strapiLocale] 
  }
);

const uniqueCategories = computed(() => {
  if (!products.value?.data) return [ALL];

  const categories = products.value.data.map(p => p.product_type);
  return [ALL, ...new Set(categories)];

});

const handleCategoryChange = (cat: string) => {
  currentCategory.value = cat;
  saleOnly.value = false;
};

const handleSort = (type: 'price_low' | 'price_high' | 'newest' | 'category' | null) => {
  sortType.value = type;
};

const filteredProducts = computed(() => {
  if (!products.value?.data) return [];

  let result = [...products.value.data];

  if (makiOnly.value) {
    result = result.filter(p => p.product_type === 'maki');
  }
  if (bowlOnly.value) {
    result = result.filter(p => p.product_type === 'bowl');
  }
  if (veganOnly.value) {
    result = result.filter(p => p.product_type === 'vegan');
  }

  if (saleOnly.value) {
    result = result.filter(p => p.on_sale === true);
  }

  const hasTypeFilter = makiOnly.value || bowlOnly.value || veganOnly.value;

  if (!hasTypeFilter && currentCategory.value !== ALL) {
    result = result.filter(p => p.product_type === currentCategory.value);
  }

  switch (sortType.value) {
    case 'price_low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case 'category':
      result.sort((a, b) => a.product_type.localeCompare(b.product_type));
      break;
  }

  return result;
});

const handleTypeFilter = (type: 'maki' | 'bowl' | 'vegan', value: boolean) => {
  makiOnly.value = false;
  bowlOnly.value = false;
  veganOnly.value = false;

  if (value) {
    if (type === 'maki') makiOnly.value = true;
    if (type === 'bowl') bowlOnly.value = true;
    if (type === 'vegan') veganOnly.value = true;
  }

  currentCategory.value = ALL;
};

</script>

<template>
  <div class="bg-page min-h-screen">
    <div class="container mx-auto max-w-7xl">
      
      <MenuControllers 
        :categories="uniqueCategories" 
        :active-category="currentCategory"
		    :sale-only="saleOnly"
        :maki-only="makiOnly"
        :bowl-only="bowlOnly"
        :vegan-only="veganOnly"
        :sort-type="sortType"
        @update:category="handleCategoryChange"
        @update:sort="handleSort"
		    @update:saleOnly="saleOnly = $event"
        @update:makiOnly="handleTypeFilter('maki', $event)"
        @update:bowlOnly="handleTypeFilter('bowl', $event)"
        @update:veganOnly="handleTypeFilter('vegan', $event)"
      />

      <div v-if="!pending" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-4 md:px-0">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :title="product.name"
          :category="product.product_type"
          :piece-count="product.piece_count"
          :on-sale="product.on_sale"
          :sale-price="product.sale_price"
          :price="product.price"
          :image="product.images?.[0]?.url"
        />
      </div>

      <div v-else class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
      
    </div>
  </div>
</template>

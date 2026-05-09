<script setup lang="ts">
const { locale, t } = useI18n();

const props = defineProps<{
  categories: string[];
  activeCategory: string;
  saleOnly: boolean;
  makiOnly: boolean;
  bowlOnly: boolean;
  veganOnly: boolean;
  sortType: string | null;
}>();

const emit = defineEmits([
  'update:category', 
  'update:sort', 
  'update:saleOnly',
  'update:makiOnly',
  'update:bowlOnly',
  'update:veganOnly'
]);

const isCategoryOpen = ref(false);
const isSortOpen = ref(false);

const anyTypeActive = computed(() => 
  props.makiOnly || props.bowlOnly || props.veganOnly
);

const isInactive = (type: 'maki' | 'bowl' | 'vegan') => {
  if (!anyTypeActive.value) return false;
  if (type === 'maki') return !props.makiOnly;
  if (type === 'bowl') return !props.bowlOnly;
  if (type === 'vegan') return !props.veganOnly;

  return false;
};

const getCategoryLabel = (cat: string) => {
  if (!cat) return '';
  const normalized = cat.toLowerCase();

  return t(`categories.${normalized}`);
};

const sortOptions = computed(() => [
  { id: 'price_low', label: t('products.sort_options.price_low') },
  { id: 'price_high', label: t('products.sort_options.price_high') },
  { id: 'newest', label: t('products.sort_options.newest') },
  { id: 'category', label: t('products.sort_options.category') }
]);

const selectCategory = (cat: string) => {
  emit('update:category', cat);
  isCategoryOpen.value = false;
};

const clearSort = () => {
  emit('update:sort', null);
  isSortOpen.value = false;
};

const selectSort = (type: string) => {
  emit('update:sort', type);
  isSortOpen.value = false;
};

onMounted(() => {
  window.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      isCategoryOpen.value = false;
      isSortOpen.value = false;
    }
  });
});
</script>

<template>
  <div class="menu-controls__types text-txt-main flex items-center justify-between py-2 px-4 md:px-0 relative z-50 font-sans">
  
  <!-- MAKI -->
  <button 
    @click="$emit('update:makiOnly', !makiOnly)"
    class="menu-controls__type-btn flex justify-center gap-3 px-5 py-3 rounded-full border shadow-sm transition-all duration-200"
    :class="[
      (!anyTypeActive || makiOnly)
        ? 'menu-controls__type-btn--active bg-primary border-primary font-bold text-white'
        : 'bg-pill border-str-light text-txt-sec', isInactive('maki') 
        ? 'opacity-50 scale-95' 
        : 'opacity-100 scale-100'
    ]"
  >
    <img 
      src="~/assets/img/sushi-icon.svg" 
      class="menu-controls__icon dark:invert w-5 h-5 md:w-6 md:h-6"
      alt="" 
    />
    <span class="menu-controls__label font-medium">
      {{ t('products.maki') }}
    </span>
  </button>

  <!-- BOWL -->
  <button 
    @click="$emit('update:bowlOnly', !bowlOnly)"
    class="menu-controls__type-btn flex justify-center gap-3 px-5 py-3 rounded-full border shadow-sm transition-all duration-200"
    :class="[
      (!anyTypeActive || bowlOnly)
        ? 'menu-controls__type-btn--active bg-primary border-primary font-bold text-white'
        : 'bg-pill border-str-light text-txt-sec', isInactive('bowl') 
        ? 'opacity-50 scale-95' 
        : 'opacity-100 scale-100'
    ]"
  >
    <img 
      src="~/assets/img/bowl-icon.svg" 
      class="menu-controls__icon dark:invert w-5 h-5 md:w-6 md:h-6"
      alt="" 
    />
    <span class="menu-controls__label font-medium">
      {{ t('products.bowl') }}
    </span>
  </button>

  <!-- VEGAN -->
  <button 
    @click="$emit('update:veganOnly', !veganOnly)"
    class="menu-controls__type-btn flex justify-center gap-3 px-5 py-3 rounded-full border shadow-sm transition-all duration-200"
    :class="[
      (!anyTypeActive || veganOnly)
        ? 'menu-controls__type-btn--active bg-primary border-primary font-bold text-white'
        : 'bg-pill border-str-light text-txt-sec', isInactive('vegan') 
        ? 'opacity-50 scale-95' 
        : 'opacity-100 scale-100'
    ]"
  >
    <img 
      src="~/assets/img/plant-icon.svg" 
      class="menu-controls__icon dark:invert w-5 h-5 md:w-6 md:h-6"
      alt="" 
    />
    <span class="menu-controls__label font-medium">
      {{ t('products.vegan') }}
    </span>
  </button>
</div>

    <div class="menu-controls__actions flex items-center justify-between pt-0 pb-3 px-4 md:px-0 relative z-50 font-sans">
      <!-- categorization btn -->
      <div class="menu-controls__category relative">
        <button 
          @click="isCategoryOpen = !isCategoryOpen"
          :class="[
            'menu-controls__btn menu-controls__btn--category flex items-center gap-2 px-5 py-2.5 border border-txt-muted rounded-full transition-all active:scale-95 shadow-sm',
          activeCategory !== 'all'
            ? 'bg-pill border-txt-muted'
            : 'bg-page border-txt-muted'
      ]"
          >
          <span class="menu-controls__label text-txt-sec font-medium capitalize"> {{ getCategoryLabel(activeCategory) }} </span>
          <img 
            src="~/assets/img/caret-down.svg" class="menu-controls__icon menu-controls__icon--caret w-4 h-4 opacity-60" 
            :class="{'rotate-180': isCategoryOpen}"
            alt=""
           />
        </button>

        <div v-if="isCategoryOpen" class="menu-controls__menu absolute left-0 mt-2 w-48 bg-page border border-str-light rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <button 
            v-for="cat in categories" :key="cat"
            v-show="cat"
            @click="selectCategory(cat)"
            class="menu-controls__menu-item w-full text-left px-4 py-3 text-sm text-txt-sec hover:bg-pill transition-colors capitalize"
            :class="{'menu-controls__menu-item--active font-bold text-primary': activeCategory === cat}"
          >
            {{ getCategoryLabel(cat) }}
          </button>
        </div>
      </div>
      <!-- sale btn -->
      <button 
        @click="$emit('update:saleOnly', !saleOnly)"
        class="menu-controls__btn menu-controls__btn--sale flex items-center gap-2 px-5 py-3 rounded-full border border-txt-muted transition-all active:scale-95 shadow-sm"
        :class="saleOnly ? 'menu-controls__btn--active bg-pill' : 'text-txt-sec bg-page'"
      >
        <span class="menu-controls__label font-medium">{{ t('products.sale') }}</span>
      </button>

      <!-- sort btn -->
      <div class="menu-controls__sort relative">
        <button 
          @click="sortType ? clearSort() : isSortOpen = !isSortOpen"
          :class="[
            'menu-controls__btn menu-controls__btn--sort flex items-center gap-2 px-5 py-2.5 border border-txt-muted rounded-full transition-all active:scale-95 shadow-sm',
            sortType ? 'bg-pill' : 'bg-page'
          ]"
        >
          <span class="menu-controls__label text-txt-sec font-medium">
            {{ sortType ? t(`products.sort_options.${sortType}`) : t('products.sort') }}
          </span>

          <span v-if="sortType" class="text-txt-sec opacity-60 text-xs font-bold pl-1">✕</span>
          <img 
            v-else
            src="~/assets/img/arrows-vertical.svg"
            class="menu-controls__icon menu-controls__icon--sort w-3 h-3 opacity-60"
            alt=""
          />
        </button>

        <div 
          v-if="isSortOpen" 
          class="menu-controls__menu menu-controls__menu--sort absolute right-0 mt-2 w-48 bg-page border border-str-light rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2"
        >
          <button 
            v-for="option in sortOptions"
            @click="selectSort(option.id)" 
            class="menu-controls__menu-item w-full text-left px-5 py-3 text-sm text-txt-sec hover:bg-pill transition-colors"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>
</template>


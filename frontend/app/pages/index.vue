<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="home__promotions">
      <h1 class="home__promotions-title capitalize text-3xl font-bold text-txt-sec mb-6">{{ $t('home.promotionsTitle') }}</h1>
      <PromotionalSlider class="home__promotions-slider" />
    </div>
    <div class="home__voucher">
      <h1 class="home__voucher-title capitalize text-3xl font-bold text-txt-sec mb-6">{{ $t('home.voucherTitle') }}</h1>
      <p class="home__voucher-paragraph">
      </p>
    </div>
  </div>
</template>
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// This handles your <Html lang="hu"> safely behind the scenes
useHead({
  htmlAttrs: {
    lang: 'hu'
  }
})
</script>
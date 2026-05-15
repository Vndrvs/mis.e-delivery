<script setup lang="ts">
const localePath = useLocalePath()

definePageMeta({
  middleware: [
    function (to, from) {
      if (process.client && window.innerWidth >= 1024) {
        const localePath = useLocalePath()
        return navigateTo(localePath('profile-contact'))
      }
    }
  ]
})
</script>

<template>
  <div></div>
</template>
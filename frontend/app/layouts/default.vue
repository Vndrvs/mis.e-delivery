<template>
  <div class="layout-default">
      <TheNavbar />

    <main class="layout-default__main">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>

<style lang="postcss" scoped>
.layout-default__main {
  @apply mb-24 mt-24 min-h-screen; 
}
</style>
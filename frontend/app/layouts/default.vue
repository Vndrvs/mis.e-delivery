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
  @apply pb-24 md:pb-0 md:pt-24 min-h-screen;
}
</style>
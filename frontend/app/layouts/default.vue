<template>
  <div class="layout-default">
    <ClientOnly>
      <TheNavbar />
    </ClientOnly>

    <main class="layout-default__main">
      <slot />
    </main>

    <TheFooter />
  </div>
</template>

<style scoped lang="postcss">
.layout-default {
  @apply relative min-h-screen bg-[#EAEAEA];
}

.layout-default__main {
  @apply pb-24 md:pb-0 md:pt-24 min-h-screen;
}
</style>
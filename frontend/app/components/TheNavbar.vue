<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
// Import your new component

const { navItems, currentPath } = useNavMenu();
const lastScrollY = ref(0);
const isVisible = ref(true);

const handleScroll = () => {
    const currentY = window.scrollY;
    isVisible.value = currentY < lastScrollY.value || currentY < 50;
    lastScrollY.value = currentY;
};

onMounted(() => window.addEventListener("scroll", handleScroll));
onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<template>
    <div>
        <header
            class="header hidden md:block fixed top-0 w-full z-40 transition-transform duration-300"
            :class="{ '-translate-y-full': !isVisible }"
        >
            <div class="header__container flex justify-between items-center bg-page px-6 py-4">
                <NavList
                    :navs="navItems"
                    :current-path="currentPath"
                />

                <NuxtLink to="/app-login" class="header__user-icon">
                    </NuxtLink>
            </div>
        </header>

        <MobileBottomNav />
    </div>
</template>
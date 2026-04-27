<script setup lang="ts">
import brandLogo from "@/assets/img/brand-outline.svg";
import userIcon from "@/assets/img/user-icon.svg";
import { ref, onMounted, onUnmounted } from "vue";
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
        <NavMobileHeader class="header lg:hidden fixed top-0 w-full transition-transform duration-300" />
        <header
            class="header hidden lg:block fixed top-0 w-full z-40 transition-transform duration-300"
            :class="{ 
                '-translate-y-full': !isVisible,
                'bg-primary shadow-md': true 
            }"
        >
            <div class="header__container mx-auto flex items-center px-6 py-3">
                
                <NuxtLink to="/" class="flex-shrink-0">

  					<div class="w-12 h-12 rounded-full bg-white flex items-center justify-center">
						<img :src="brandLogo"
							alt="Brand Logo" 
							class="h-10 w-auto icon-black header__brand"  />
					</div>
                </NuxtLink>

                <div class="flex-grow flex justify-center">
                    <NavList
                        :navs="navItems"
                        :current-path="currentPath"
                        class="flex items-center"
                    />
                </div>

                <NuxtLink to="/app-login" class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                        <img 
                            :src="userIcon" 
                            class="w-6 h-6 icon-white" 
                            alt="User" 
                        />
                    </div>
                </NuxtLink>
            </div>
        </header>

        <NavMobileBottomNav />
    </div>
</template>

<style scoped lang="postcss">
.icon-white {
  filter: brightness(0) invert(1);
}

.header__brand {
	filter: brightness(0) saturate(100%) invert(41%) sepia(92%) saturate(710%) hue-rotate(287deg) brightness(103%) contrast(97%);
}
</style>
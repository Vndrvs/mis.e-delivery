import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

export const useMobileMenu = () => {
	return {
		isMobileMenuOpen,
		toggleMobileMenu,
	};
};
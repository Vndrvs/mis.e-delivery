import { computed } from "vue";
import { getNavigation } from "~/utils/useNavigation";

export const useNavMenu = () => {
	const route = useRoute();

	const where = computed<"home" | "admin">(() => {
		return route.path.startsWith("/admin")
			? "admin"
			: "home";
	});

	const navItems = computed(() => {
		return getNavigation(where.value);
	});

	const currentPath = computed(() => route.path);

	return {
		navItems,
		currentPath,
	};
};
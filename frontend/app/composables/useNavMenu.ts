export const useNavMenu = () => {
	
	const route = useRoute();
	const { t } = useI18n();
	
	const where = computed<"home" | "admin">(() => {
		const path = route?.path || '';
		return path.startsWith("/admin") ? "admin" : "home";
	});
	
	const navItems = computed(() => {
		return getNavigation(where.value, t);
	});
	
	const currentPath = computed(() => route?.path || '/');
	
	return {
		navItems,
		currentPath,
		
	};
	
};
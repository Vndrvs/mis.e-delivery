type Where = "home" | "admin";

export type Navigation = {
	name: string;
	to: string;
	children?: Navigation[];
};

export function getNavigation(where: Where, t: any): Navigation[] {
  switch (where) {
    case "home":
      return [
        { name: t('nav.home'), to: 'index' },
        { name: t('nav.menu'), to: 'menu' },
        { name: t('nav.cart'), to: 'cart' },
        { name: t('nav.orders'), to: 'orders' },
        { name: t('nav.profile'), to: 'profile' },
      ];
    case "admin":
      return [
        { name: t('nav.products'), to: 'admin-products' },
        { name: t('nav.orders'), to: 'admin-orders' },
        { name: t('nav.analytics'), to: 'admin-analytics' },
      ];
    default:
      return [];
  }
}
import homeIcon from '~/assets/img/home-icon.svg';
import menuIcon from '~/assets/img/menu-icon.svg';
import cartIcon from '~/assets/img/cart-icon.svg';
import boxIcon from '~/assets/img/box-icon.svg';
import userIcon from '~/assets/img/user-icon.svg';
import brandLogo from '~/assets/img/brand-logo.svg';

type Where = "home" | "admin";

export type Navigation = {
  name: string;
  to: string;
  icon?: string; // set to optional until I collect svgs to the admin panel
  children?: Navigation[];
};

export function getNavigation(
  where: Where, 
  t: any, 
  localePath: (route: string) => string // Define as a function taking one string
): Navigation[] {
  
  // Safety check to prevent the 500 error if initialization fails
  if (typeof localePath !== 'function') {
    return [];
  }

  switch (where) {
    case "home":
      return [
        { name: t('nav.home'), to: localePath('index'), icon: homeIcon },
        { name: t('nav.menu'), to: localePath('menu'), icon: menuIcon },
        { name: t('nav.cart'), to: localePath('cart'), icon: cartIcon },
        { name: t('nav.orders'), to: localePath('orders'), icon: boxIcon },
        { name: t('nav.profile'), to: localePath('profile'), icon: userIcon },
      ];
    case "admin":
      return [
        { name: t('nav.products'), to: localePath('admin-products') },
        { name: t('nav.orders'), to: localePath('admin-orders') },
        { name: t('nav.analytics'), to: localePath('admin-analytics') },
      ];
    default:
      return [];
  }
}
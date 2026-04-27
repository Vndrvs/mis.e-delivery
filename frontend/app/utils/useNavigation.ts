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

export function getNavigation(where: Where, t: any): Navigation[] {
  switch (where) {
    case "home":
      return [
        { name: t('nav.home'), to: 'index', icon: homeIcon },
        { name: t('nav.menu'), to: 'menu', icon: menuIcon },
        { name: t('nav.cart'), to: 'cart', icon: cartIcon },
        { name: t('nav.orders'), to: 'orders', icon: boxIcon },
        { name: t('nav.profile'), to: 'profile', icon: userIcon },
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
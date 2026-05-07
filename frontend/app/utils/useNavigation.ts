import homeIcon from '~/assets/img/home-icon.svg';
import menuIcon from '~/assets/img/menu-icon.svg';
import cartIcon from '~/assets/img/cart-icon.svg';
import boxIcon from '~/assets/img/box-icon.svg';
import userIcon from '~/assets/img/user-icon.svg';

type Where = "home" | "profile" | "admin";

export type Navigation = {
  name: string;
  to: string;
  icon?: string; 
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
        { name: t('nav.profile'), to: 'profile', icon: userIcon }
      ];
    case "profile":
      return [
        { name: t('profile.contact'), to: 'profile-contact' },
        { name: t('profile.history'), to: 'profile-history' },
        { name: t('profile.payments'), to: 'profile-payments' },
        { name: t('profile.addresses'), to: 'profile-addresses' },
        { name: t('profile.settings'), to: 'profile-settings' },
        { name: t('profile.support'), to: 'profile-support' },
        { name: t('profile.logout'), to: 'logout' },
      ];
    case "admin":
      return [
        { name: t('nav.products'), to: 'admin-products' },
        { name: t('nav.orders'), to: 'admin-orders' },
        { name: t('nav.analytics'), to: 'admin-analytics' }
      ];
    default:
      return [];
  }
}
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useStrapiUser()
  const localePath = useLocalePath()
  
  const guestMode = useCookie('guest_mode', { maxAge: 60 * 60 * 24 })

  const publicRoutes = ['startup', 'login', 'register']
  const isPublicRoute = publicRoutes.some(route => to.name?.toString().includes(route))

  if ((user.value || guestMode.value) && to.name?.toString().includes('startup')) {
    return navigateTo(localePath('index'))
  }

  if (!user.value && !guestMode.value && !isPublicRoute) {
    return navigateTo(localePath('startup'))
  }
})
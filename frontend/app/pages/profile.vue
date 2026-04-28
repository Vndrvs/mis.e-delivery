<script setup lang="ts">
const user = useStrapiUser()
const { logout } = useStrapiAuth()
const localePath = useLocalePath() 

definePageMeta({
  middleware: () => {
    const user = useStrapiUser()
    const localePath = useLocalePath() // Need to call it inside the middleware context too
    
    if (!user.value) {
      return navigateTo(localePath('login')) 
    }
  }
})

async function handleLogout() {
  await logout()
  await navigateTo(localePath('login')) 
}
</script>

<template>
  <div class="profile-page min-h-screen bg-white p-6 max-w-2xl mx-auto pt-20">
    <div v-if="user" class="flex flex-col gap-8">
      <header>
        <h1 class="text-3xl font-bold text-txt-sec">Saját profil</h1>
        <p class="text-txt-muted mt-2">Itt találod a fiókod adatait.</p>
      </header>

      <div class="bg-page rounded-2xl p-6 border border-str-light shadow-sm flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-txt-muted uppercase tracking-wider">Felhasználónév</label>
          <p class="text-lg font-medium text-txt-sec">{{ user.username }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-txt-muted uppercase tracking-wider">Email cím</label>
          <p class="text-lg font-medium text-txt-sec">{{ user.email }}</p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-txt-muted uppercase tracking-wider">Fiók állapota</label>
          <span class="inline-flex items-center gap-1.5 text-green-600 font-bold text-sm">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            Aktív (Authenticated)
          </span>
        </div>
      </div>

      <button 
        @click="handleLogout"
        class="w-full py-4 rounded-xl border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
      >
        Kijelentkezés
      </button>
    </div>
  </div>
</template>
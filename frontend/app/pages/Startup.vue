<script setup lang="ts">

const form = reactive({
  email: '',
  password: ''
})
</script>

<template>
  <main class="login-page">
    <div class="login-page__background">
      <img 
        src="~/assets/img/start-background.webp"
        alt="Background of start page"
        class="login-page__background-image"
      />
    </div>

    <div class="login-page__gradient-overlay"></div>

    <div class="login-page__content">
      <section class="login-page__card">
        <header class="login-page__header">
          <h1 class="login-page__title">Welcome Back</h1>
          <p class="login-page__subtitle">Please enter your details to sign in</p>
        </header>

        <form class="login-page__form">
          <div class="login-page__field">
            <label for="email" class="login-page__label">Email Address</label>
            <input 
              id="email"
              v-model="form.email"
              type="email" 
              placeholder="e.g. name@company.com"
              class="login-page__input"
              required
            />
          </div>

          <div class="login-page__field">
            <label for="password" class="login-page__label">Password</label>
            <input 
              id="password"
              v-model="form.password"
              type="password" 
              placeholder="••••••••"
              class="login-page__input"
              required
            />
          </div>

          <div class="login-page__error">
            
          </div>

          <button 
            type="submit" 
            class="login-page__submit-button"

          >
          </button>
        </form>

        <footer class="login-page__footer">
          <p class="login-page__footer-text">
            Don't have an account? <a href="#" class="login-page__link">Register</a>
          </p>
        </footer>
      </section>
    </div>
  </main>
</template>

<style lang="postcss">
.login-page {
  @apply relative min-h-screen w-full overflow-hidden flex items-center justify-center;
  background-color: #EAEAEA;
}

.login-page__background {
  @apply absolute inset-0 z-0;
}

.login-page__background-image {
  @apply w-full h-full object-cover;
}

/* Linear gradient from #EAEAEA to transparent */
.login-page__gradient-overlay {
  @apply absolute inset-0 z-10;
  background: linear-gradient(to bottom, #EAEAEA 0%, transparent 100%);
}

.login-page__content {
  @apply relative z-20 w-full max-w-md px-6;
}

.login-page__card {
  @apply bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20;
}

.login-page__header {
  @apply mb-8 text-center;
}

.login-page__title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.login-page__subtitle {
  @apply text-gray-600;
}

.login-page__form {
  @apply space-y-6;
}

.login-page__field {
  @apply flex flex-col gap-2;
}

.login-page__label {
  @apply text-sm font-semibold text-gray-700;
}

.login-page__input {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all;
}

.login-page__error {
  @apply text-red-500 text-sm font-medium;
}

.login-page__submit-button {
  @apply w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50;
}

.login-page__footer {
  @apply mt-8 text-center;
}

.login-page__footer-text {
  @apply text-gray-600 text-sm;
}

.login-page__link {
  @apply text-blue-600 font-semibold hover:underline;
}
</style>
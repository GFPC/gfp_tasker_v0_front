<script setup>
import { ref } from 'vue'
import { authApi } from '../../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Пожалуйста, заполните все поля'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await authApi.login({
      email: email.value,
      password: password.value
    })

    const { access_token, refresh_token } = response.data
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)

    await router.push('/')
  } catch (err) {
    console.log(err)
    error.value = err.response?.data?.message || 'Ошибка при входе'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-form">
    <h2 class="auth-form-title">Вход в систему</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="auth-form-error">
        {{ error }}
      </div>

      <div class="auth-form-group">
        <label for="email" class="auth-form-label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="auth-form-input"
          required
        >
      </div>

      <div class="auth-form-group">
        <label for="password" class="auth-form-label">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="auth-form-input"
          required
        >
      </div>

      <button
        type="submit"
        class="auth-form-button btn btn-primary"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="animate-spin mr-2">⌛</span>
        Войти
      </button>
    </form>
  </div>
</template> 
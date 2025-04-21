<script setup>
import { ref } from 'vue'
import { authApi } from '../../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Пожалуйста, заполните все поля'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await authApi.register({
      name: name.value,
      email: email.value,
      password: password.value
    })

    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка при регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-form">
    <h2 class="auth-form-title">Регистрация</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="auth-form-error">
        {{ error }}
      </div>

      <div class="auth-form-group">
        <label for="name" class="auth-form-label">Имя</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="auth-form-input"
          required
        >
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

      <div class="auth-form-group">
        <label for="confirmPassword" class="auth-form-label">Подтверждение пароля</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
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
        Зарегистрироваться
      </button>
    </form>
  </div>
</template> 
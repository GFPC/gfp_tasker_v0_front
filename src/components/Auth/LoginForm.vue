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
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Вход в систему</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <button
        type="submit"
        class="w-full btn btn-primary"
        :disabled="isLoading"
      >
        <span v-if="isLoading" class="animate-spin mr-2">⌛</span>
        Войти
      </button>
    </form>
  </div>
</template> 
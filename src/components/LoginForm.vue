<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleSubmit = async () => {
  try {
    const response = await authApi.login({
      email: email.value,
      password: password.value
    })
    
    // Сохраняем токен
    localStorage.setItem('access_token', response.data.access_token)
    
    // Перенаправляем на главную страницу
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при входе'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Вход</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>
      
      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Войти
      </button>
    </form>
  </div>
</template> 
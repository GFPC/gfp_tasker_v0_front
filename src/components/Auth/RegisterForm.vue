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
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Регистрация</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-3 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Имя</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
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

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Подтверждение пароля</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
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
        Зарегистрироваться
      </button>
    </form>
  </div>
</template> 
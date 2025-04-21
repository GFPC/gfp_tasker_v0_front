<template>
  <div class="min-h-screen flex items-center justify-center bg-primary">
    <div class="max-w-md w-full p-8 card">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p class="text-secondary">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-primary mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-primary mb-1">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter your password"
          />
        </div>

        <div v-if="error" class="p-3 rounded-lg bg-danger text-white text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading" class="inline-block animate-spin mr-2">⟳</span>
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-secondary">
          Don't have an account?
          <router-link to="/register" class="text-accent hover:text-tertiary">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  try {
    await authStore.login(form.value);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script> 
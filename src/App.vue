<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { projectsApi, tasksApi, usersApi, authApi } from './services/api'
import './assets/main.css'
import ThemeToggle from './components/ThemeToggle.vue'
import './styles/themes.css'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Состояние авторизации
const isAuthenticated = authStore.isAuthenticated
const currentUser = ref(null)
const showLoginForm = ref(false)
const showRegisterForm = ref(false)

// Проверка авторизации
const checkAuth = async () => {
  const token = localStorage.getItem('access_token')
  if (token) {
    try {
      const response = await usersApi.getMe()
      currentUser.value = response.data
      isAuthenticated.value = true
    } catch (error) {
      localStorage.removeItem('access_token')
      router.push('/login')
    }
  } else {
    router.push('/login')
  }
}

// Выход из системы
const logout = async () => {
  try {
    await authApi.logout()
  } finally {
    localStorage.removeItem('access_token')
    currentUser.value = null
    isAuthenticated.value = false
    router.push('/login')
  }
}

// Текущий активный раздел
const activeSection = ref('projects')
const isLoading = ref(false)
const error = ref(null)

// Модальные окна
const showProjectForm = ref(false)
const showTaskForm = ref(false)
const selectedProject = ref(null)
const selectedTask = ref(null)

// Функция для переключения разделов
function switchSection(section) {
  activeSection.value = section
}

// Данные
const tasks = ref([])
const projects = ref([])
const employees = ref([])

// Загрузка данных
async function loadData() {
  if (!isAuthenticated.value) return

  isLoading.value = true
  error.value = null
  
  try {
    if (activeSection.value === 'projects') {
      const [projectsResponse, tasksResponse] = await Promise.all([
        projectsApi.getAll(),
        tasksApi.getAll()
      ])
      projects.value = projectsResponse.data
      tasks.value = tasksResponse.data
    } else if (activeSection.value === 'tasks') {
      const tasksResponse = await tasksApi.getAll()
      tasks.value = tasksResponse.data
    } else if (activeSection.value === 'employees') {
      const usersResponse = await usersApi.getAll()
      employees.value = usersResponse.data
    }
  } catch (err) {
    error.value = err.message || 'Произошла ошибка при загрузке данных'
    console.error('Error loading data:', err)
  } finally {
    isLoading.value = false
  }
}

// Обработчики действий
async function deleteProject(projectId) {
  try {
    await projectsApi.delete(projectId)
    projects.value = projects.value.filter(p => p.id !== projectId)
    tasks.value = tasks.value.filter(t => t.projectId !== projectId)
  } catch (err) {
    error.value = err.message || 'Ошибка при удалении проекта'
    console.error('Error deleting project:', err)
  }
}

async function deleteTask(taskId) {
  try {
    await tasksApi.delete(taskId)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (err) {
    error.value = err.message || 'Ошибка при удалении задачи'
    console.error('Error deleting task:', err)
  }
}

function openProjectForm(project = null) {
  selectedProject.value = project
  showProjectForm.value = true
}

function openTaskForm(task = null) {
  selectedTask.value = task
  showTaskForm.value = true
}

// Загрузка данных при монтировании и при смене раздела
onMounted(() => {
  checkAuth()
  if (isAuthenticated.value) {
    loadData()
  }
})

watch(activeSection, () => {
  if (isAuthenticated.value) {
    loadData()
  }
})

const projectTasks = computed(() => (projectId) => {
  return tasks.value.filter(task => task.projectId === projectId)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-secondary border-b border-border-color py-4">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <router-link to="/" class="logo flex items-center gap-3">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L20 9l-8 4-8-4 8-4.2zM4 9.2l8 4v8.6l-8-4V9.2zm10 12.6v-8.6l8-4v8.6l-8 4z"/>
          </svg>
          <span>GF Tasker</span>
        </router-link>
        <div class="flex items-center gap-4">
          <template v-if="!isAuthenticated">
            <router-link to="/login" class="btn btn-secondary">
              Sign In
            </router-link>
            <router-link to="/register" class="btn btn-primary">
              Sign Up
            </router-link>
          </template>
          <template v-else>
            <ThemeToggle />
          </template>
        </div>
      </div>
    </header>
    <main class="flex-1 bg-primary">
      <router-view v-slot="{ Component }">
        <component :is="Component" :is-mobile-menu-open="isMobileMenuOpen" @toggle-mobile-menu="toggleMobileMenu" />
      </router-view>
    </main>
  </div>
</template>

<style>
@import '@/styles/themes.css';
</style>

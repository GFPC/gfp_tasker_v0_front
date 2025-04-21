<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Task from './components/Task.vue'
import Project from './components/Project.vue'
import LoginForm from './components/Auth/LoginForm.vue'
import RegisterForm from './components/Auth/RegisterForm.vue'
import ProjectForm from './components/Project/ProjectForm.vue'
import TaskForm from './components/Task/TaskForm.vue'
import { projectsApi, tasksApi, usersApi, authApi } from './services/api'
import './assets/main.css'
import ThemeToggle from './components/ThemeToggle.vue'
import './styles/themes.css'

const router = useRouter()

// Состояние авторизации
const isAuthenticated = ref(false)
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

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-primary">
    <header class="fixed top-0 left-0 right-0 h-16 bg-secondary border-b border-border-color z-50">
      <div class="container mx-auto h-full px-4 flex items-center justify-between">
        <!-- Mobile menu button -->
        <button 
          class="mobile-menu-button lg:hidden"
          @click="toggleMobileMenu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo - centered on mobile -->
        <div class="flex-1 lg:flex-none flex justify-center lg:justify-start">
          <a href="/" class="logo">
            <svg class="logo-icon hidden lg:block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>GFP Tasker v0</span>
          </a>
        </div>

        <!-- Theme toggle - right side -->
        <div class="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
    <main class="pt-16">
      <router-view />
    </main>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Task from './components/Task.vue'
import Project from './components/Project.vue'
import LoginForm from './components/Auth/LoginForm.vue'
import RegisterForm from './components/Auth/RegisterForm.vue'
import ProjectForm from './components/Project/ProjectForm.vue'
import TaskForm from './components/Task/TaskForm.vue'
import { projectsApi, tasksApi, usersApi, authApi } from './services/api'
import './assets/main.css'
import ThemeToggle from './components/ThemeToggle.vue'
import './styles/themes.css'

const router = useRouter()

// Состояние авторизации
const isAuthenticated = ref(false)
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
  <div class="min-h-screen bg-primary">
    <header class="fixed top-0 left-0 right-0 h-16 bg-secondary border-b border-border-color z-50">
      <div class="container mx-auto h-full px-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a href="/" class="logo">
            <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>GFP Tasker v0</span>
          </a>
        </div>
        <div class="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
    <main class="pt-16">
      <router-view />
    </main>
  </div>
</template>

<style>
@import './styles/themes.css';
</style>

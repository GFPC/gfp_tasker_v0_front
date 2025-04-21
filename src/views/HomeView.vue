<script setup>
import { ref, onMounted } from 'vue'
import { projectsApi, tasksApi } from '../services/api'
import ProjectList from '../components/Project/ProjectList.vue'
import TaskList from '../components/Task/TaskList.vue'
import ProjectForm from '../components/Project/ProjectForm.vue'
import TaskForm from '../components/Task/TaskForm.vue'

const activeSection = ref('projects')
const projects = ref([])
const tasks = ref([])
const isLoading = ref(false)
const error = ref(null)

const showProjectForm = ref(false)
const showTaskForm = ref(false)

const isMobileMenuOpen = ref(false)

const loadData = async () => {
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
      const [tasksResponse, projectsResponse] = await Promise.all([
        tasksApi.getAll(),
        projectsApi.getAll()
      ])
      tasks.value = tasksResponse.data.map(task => ({
        ...task,
        project: projectsResponse.data.find(p => p.id === task.project_id)
      }))
    }
  } catch (err) {
    error.value = err.message || 'Произошла ошибка при загрузке данных'
    console.error('Error loading data:', err)
  } finally {
    isLoading.value = false
  }
}

const switchSection = (section) => {
  activeSection.value = section
  closeMobileMenu()
  loadData()
}

const openProjectForm = () => {
  showProjectForm.value = true
}

const closeProjectForm = () => {
  showProjectForm.value = false
}

const openTaskForm = () => {
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
}

const handleProjectSuccess = () => {
  loadData()
}

const handleTaskSuccess = () => {
  loadData()
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

onMounted(loadData)
</script>

<template>
  <div class="flex h-full">
    <!-- Mobile menu button -->
    <button
      @click="toggleMobileMenu"
      class="mobile-menu-button lg:hidden"
      :class="{ 'text-accent': isMobileMenuOpen }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          v-if="isMobileMenuOpen"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Mobile overlay -->
    <div
      class="mobile-overlay lg:hidden"
      :class="{ active: isMobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>

    <!-- Боковое меню -->
    <aside class="sidebar" :class="{ active: isMobileMenuOpen }">
      <div class="sidebar-header">
        <h2 class="sidebar-title">Меню</h2>
      </div>
      <nav class="sidebar-nav">
        <ul class="space-y-2">
          <li class="sidebar-item">
            <button 
              @click="switchSection('projects')"
              class="sidebar-button"
              :class="{ active: activeSection === 'projects' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Проекты
            </button>
          </li>
          <li class="sidebar-item">
            <button 
              @click="switchSection('tasks')"
              class="sidebar-button"
              :class="{ active: activeSection === 'tasks' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Задачи
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Основной контент -->
    <main class="main-content flex-1 p-4 lg:p-6 lg:ml-[280px] mt-16">
      <!-- Сообщение об ошибке -->
      <div v-if="error" class="mb-4 p-4 bg-danger text-white rounded-lg">
        {{ error }}
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>

      <!-- Проекты -->
      <div v-else-if="activeSection === 'projects'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-primary">Проекты</h2>
          <button 
            class="btn btn-primary"
            @click="openProjectForm"
          >
            Новый проект
          </button>
        </div>
        <ProjectList 
          :projects="projects"
          :tasks="tasks"
        />
      </div>

      <!-- Задачи -->
      <div v-else-if="activeSection === 'tasks'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-primary">Все задачи</h2>
          <button 
            class="btn btn-primary"
            @click="openTaskForm"
          >
            Новая задача
          </button>
        </div>
        <TaskList :tasks="tasks" />
      </div>
    </main>

    <!-- Форма проекта -->
    <ProjectForm
      v-if="showProjectForm"
      @close="closeProjectForm"
      @success="handleProjectSuccess"
    />

    <!-- Форма задачи -->
    <TaskForm
      v-if="showTaskForm"
      @close="closeTaskForm"
      @success="handleTaskSuccess"
    />
  </div>
</template> 
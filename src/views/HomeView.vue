<template>
  <div v-if="!isAuthenticated" class="landing-page">
    <!-- Hero Section -->
    <section class="hero py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6 text-primary">
          Manage Your Tasks with Ease
        </h1>
        <p class="text-xl text-secondary mb-8 max-w-2xl mx-auto">
          A powerful task management tool that helps you stay organized and productive.
          Create projects, track tasks, and collaborate with your team.
        </p>
        <div class="flex justify-center gap-4">
          <router-link to="/register" class="btn btn-primary">
            Get Started
          </router-link>
          <router-link to="/login" class="btn btn-secondary">
            Sign In
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-16 bg-tertiary">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-primary">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card p-6">
            <div class="text-accent mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-primary">Project Management</h3>
            <p class="text-secondary">Organize your work into projects and track progress efficiently.</p>
          </div>
          <div class="card p-6">
            <div class="text-accent mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-primary">Task Tracking</h3>
            <p class="text-secondary">Create, assign, and monitor tasks with ease. Set priorities and due dates.</p>
          </div>
          <div class="card p-6">
            <div class="text-accent mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-primary">Team Collaboration</h3>
            <p class="text-secondary">Work together with your team members and share project updates.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6 text-primary">Ready to Get Started?</h2>
        <p class="text-xl text-secondary mb-8 max-w-2xl mx-auto">
          Join thousands of users who are already managing their tasks efficiently with GF Tasker.
        </p>
        <router-link to="/register" class="btn btn-primary">
          Create Your Free Account
        </router-link>
      </div>
    </section>
  </div>

  <!-- Authenticated User View -->
  <div v-else class="flex">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'active': isMobileMenuOpen }">
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4 text-primary">Menu</h2>
        <nav class="space-y-2">
          <button 
            @click="switchSection('projects')"
            class="sidebar-button w-full text-left"
            :class="{ 'active': currentSection === 'projects' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Projects
          </button>
          <button 
            @click="switchSection('tasks')"
            class="sidebar-button w-full text-left"
            :class="{ 'active': currentSection === 'tasks' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tasks
          </button>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <div v-if="currentSection === 'projects'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">Projects</h1>
          <button @click="openProjectForm" class="btn btn-primary">
            New Project
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="project in projects" :key="project.id" class="card p-6">
            <h3 class="text-xl font-semibold mb-2 text-primary">{{ project.name }}</h3>
            <p class="text-secondary mb-4">{{ project.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-sm text-secondary">
                {{ projectTasks(project.id).length }} tasks
              </span>
              <div class="flex gap-2">
                <button @click="openTaskForm(project)" class="btn btn-secondary">
                  Add Task
                </button>
                <button @click="deleteProject(project.id)" class="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentSection === 'tasks'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">Tasks</h1>
          <button @click="openTaskForm" class="btn btn-primary">
            New Task
          </button>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div v-for="task in tasks" :key="task.id" class="card p-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-primary">{{ task.title }}</h3>
                <p class="text-secondary">{{ task.description }}</p>
              </div>
              <div class="flex gap-2">
                <button @click="openTaskForm(task)" class="btn btn-secondary">
                  Edit
                </button>
                <button @click="deleteTask(task.id)" class="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Project Form Modal -->
    <ProjectForm
      v-if="showProjectForm"
      :project="selectedProject"
      @success="handleProjectSuccess"
      @close="closeProjectForm"
    />

    <!-- Task Form Modal -->
    <TaskForm
      v-if="showTaskForm"
      :task="selectedTask"
      @success="handleTaskSuccess"
      @close="closeTaskForm"
    />

    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { projectsApi, tasksApi } from '@/services/api'
import ProjectList from '@/components/Project/ProjectList.vue'
import TaskList from '@/components/Task/TaskList.vue'
import ProjectForm from '@/components/Project/ProjectForm.vue'
import TaskForm from '@/components/Task/TaskForm.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => !!authStore.token)

// Mobile menu state
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Section state
const currentSection = ref('projects')
const projects = ref([])
const tasks = ref([])
const loading = ref(false)
const error = ref(null)

const switchSection = (section) => {
  currentSection.value = section
  loadData()
}

const loadData = async () => {
  if (!isAuthenticated.value) return

  loading.value = true
  error.value = null
  
  try {
    if (currentSection.value === 'projects') {
      const [projectsResponse, tasksResponse] = await Promise.all([
        projectsApi.getAll(),
        tasksApi.getAll()
      ])
      projects.value = projectsResponse.data
      tasks.value = tasksResponse.data
    } else if (currentSection.value === 'tasks') {
      const tasksResponse = await tasksApi.getAll()
      tasks.value = tasksResponse.data
    }
  } catch (err) {
    error.value = err.message || 'Error loading data'
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

const projectTasks = computed(() => (projectId) => {
  return tasks.value.filter(task => task.projectId === projectId)
})

// Form states
const showProjectForm = ref(false)
const showTaskForm = ref(false)
const selectedProject = ref(null)
const selectedTask = ref(null)

const openProjectForm = (project = null) => {
  selectedProject.value = project
  showProjectForm.value = true
}

const closeProjectForm = () => {
  showProjectForm.value = false
  selectedProject.value = null
}

const openTaskForm = (task = null) => {
  selectedTask.value = task
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
  selectedTask.value = null
}

const handleProjectSuccess = () => {
  closeProjectForm()
}

const handleTaskSuccess = () => {
  closeTaskForm()
}

const deleteProject = async (projectId) => {
  try {
    await projectsApi.delete(projectId)
    projects.value = projects.value.filter(p => p.id !== projectId)
    tasks.value = tasks.value.filter(t => t.projectId !== projectId)
  } catch (err) {
    error.value = err.message || 'Error deleting project'
    console.error('Error deleting project:', err)
  }
}

const deleteTask = async (taskId) => {
  try {
    await tasksApi.delete(taskId)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (err) {
    error.value = err.message || 'Error deleting task'
    console.error('Error deleting task:', err)
  }
}

// Load initial data
loadData()
</script>

<style scoped>
.landing-page {
  min-height: calc(100vh - 4rem);
}

.hero {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}

.features .card {
  transition: transform 0.3s ease;
}

.features .card:hover {
  transform: translateY(-5px);
}

.cta {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.sidebar {
  width: 250px;
  background-color: var(--secondary);
  border-right: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

.sidebar-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.sidebar-button:hover {
  background-color: var(--hover-color);
}

.sidebar-button.active {
  background-color: var(--primary);
  color: var(--primary-text);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
  }

  .sidebar.active {
    transform: translateX(0);
  }
}
</style> 
<script setup>
import { ref } from 'vue'
import TaskForm from './TaskForm.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => []
  },
  projects: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['success'])

const showTaskForm = ref(false)
const editingTask = ref(null)

const openTaskForm = (task = null) => {
  editingTask.value = task
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
  editingTask.value = null
}

const handleTaskSuccess = () => {
  emit('success')
  closeTaskForm()
}

const getProjectName = (projectId) => {
  const project = props.projects.find(p => p.id === projectId)
  return project ? project.name : 'Unknown Project'
}

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Завершена'
    case 'in_progress':
      return 'В работе'
    case 'pending':
      return 'Ожидает'
    default:
      return status
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'pending':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-primary">Tasks</h2>
      <button @click="openTaskForm()" class="btn btn-primary">
        New Task
      </button>
    </div>

    <div v-if="tasks.length === 0" class="text-center py-8">
      <p class="text-tertiary">No tasks yet. Create your first task!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="card p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-primary">{{ task.title }}</h3>
            <p class="text-tertiary text-sm mt-1">
              {{ getProjectName(task.project_id) }}
            </p>
          </div>
          <button
            @click="openTaskForm(task)"
            class="btn btn-secondary"
          >
            Edit
          </button>
        </div>
        <p class="text-secondary mb-4">{{ task.description }}</p>
        <div class="flex justify-between items-center">
          <span
            :class="{
              'badge-success': task.status === 'completed',
              'badge-warning': task.status === 'in_progress',
              'badge-danger': task.status === 'pending'
            }"
            class="badge"
          >
            {{ task.status }}
          </span>
          <span class="text-tertiary text-sm">
            Due: {{ new Date(task.due_date).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>

    <TaskForm
      v-if="showTaskForm"
      :task="editingTask"
      :projects="projects"
      @success="handleTaskSuccess"
      @close="closeTaskForm"
    />
  </div>
</template> 
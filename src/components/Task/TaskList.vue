<script setup>
import { ref } from 'vue'
import TaskForm from './TaskForm.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['success'])

const showTaskForm = ref(false)
const selectedTask = ref(null)

const openTaskForm = (task = null) => {
  selectedTask.value = task
  showTaskForm.value = true
}

const closeTaskForm = () => {
  showTaskForm.value = false
  selectedTask.value = null
}

const handleTaskSuccess = () => {
  emit('success')
  closeTaskForm()
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
    <div v-if="tasks.length === 0" class="text-center py-12">
      <p class="text-tertiary">Нет задач</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="card"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-primary">{{ task.title }}</h3>
            <p class="text-secondary mt-1">{{ task.description }}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span class="text-sm text-tertiary">
                Проект: {{ task.project?.name || 'Без проекта' }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2">
            <span 
              class="badge"
              :class="getStatusClass(task.status)"
            >
              {{ getStatusText(task.status) }}
            </span>
            <button 
              @click="openTaskForm(task)"
              class="btn btn-secondary"
            >
              Редактировать
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Форма задачи -->
  <TaskForm
    v-if="showTaskForm"
    :task="selectedTask"
    @close="closeTaskForm"
    @success="handleTaskSuccess"
  />
</template> 
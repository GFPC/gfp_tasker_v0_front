<script setup>
import { ref, onMounted } from 'vue'
import { tasksApi, projectsApi } from '../../services/api'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const title = ref('')
const description = ref('')
const projectId = ref('')
const status = ref('pending')
const priority = ref('medium')
const dueDate = ref('')

const projects = ref([])
const isLoading = ref(false)
const error = ref(null)

const statusOptions = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'completed', label: 'Завершена' }
]

const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' }
]

const loadData = async () => {
  try {
    const projectsResponse = await projectsApi.getAll()
    projects.value = projectsResponse.data
  } catch (err) {
    error.value = 'Ошибка при загрузке данных'
  }
}

onMounted(async () => {
  await loadData()
  
  if (props.task) {
    title.value = props.task.title
    description.value = props.task.description
    projectId.value = props.task.project_id
    status.value = props.task.status
    priority.value = props.task.priority
    dueDate.value = props.task.due_date
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    const taskData = {
      title: title.value,
      description: description.value,
      project_id: projectId.value,
      status: status.value,
      priority: priority.value,
      due_date: dueDate.value
    }

    if (props.task) {
      await tasksApi.update(props.task.id, taskData)
    } else {
      await tasksApi.create(taskData)
    }

    emit('success')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Произошла ошибка при сохранении задачи'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">
        {{ task ? 'Редактировать задачу' : 'Новая задача' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Название</label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Описание</label>
          <textarea
            id="description"
            v-model="description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 resize-none overflow-y-auto"
          ></textarea>
        </div>

        <div>
          <label for="project" class="block text-sm font-medium text-gray-700">Проект</label>
          <select
            id="project"
            v-model="projectId"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Без проекта</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Статус</label>
          <select
            id="status"
            v-model="status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Приоритет</label>
          <select
            id="priority"
            v-model="priority"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          >
            <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Срок выполнения</label>
          <input
            id="dueDate"
            v-model="dueDate"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isLoading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template> 
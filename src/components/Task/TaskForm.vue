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
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">{{ task ? 'Редактировать задачу' : 'Новая задача' }}</h3>
        <button class="modal-close" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label class="form-label">Название задачи</label>
            <input
              type="text"
              v-model="title"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Описание</label>
            <textarea
              v-model="description"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Проект</label>
            <select
              v-model="projectId"
              class="form-select"
              required
            >
              <option value="">Выберите проект</option>
              <option
                v-for="project in projects"
                :key="project.id"
                :value="project.id"
              >
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Статус</label>
            <select
              v-model="status"
              class="form-select"
              required
            >
              <option value="todo">К выполнению</option>
              <option value="in_progress">В процессе</option>
              <option value="done">Выполнено</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Приоритет</label>
            <select
              v-model="priority"
              class="form-select"
              required
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Срок выполнения</label>
            <input
              type="date"
              v-model="dueDate"
              class="form-input"
            />
          </div>
          <div v-if="error" class="form-error">{{ error }}</div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Отмена
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Сохранение...' : (task ? 'Сохранить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 
<script setup>
import { ref, onMounted } from 'vue'
import { projectsApi } from '../../services/api'

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const name = ref('')
const description = ref('')
const isLoading = ref(false)
const error = ref(null)

onMounted(() => {
  if (props.project) {
    name.value = props.project.name
    description.value = props.project.description
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    const projectData = {
      name: name.value,
      description: description.value
    }

    if (props.project) {
      await projectsApi.update(props.project.id, projectData)
    } else {
      await projectsApi.create(projectData)
    }

    emit('success')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Произошла ошибка при сохранении проекта'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">{{ project ? 'Редактировать проект' : 'Новый проект' }}</h3>
        <button class="modal-close" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label class="form-label">Название проекта</label>
            <input
              type="text"
              v-model="name"
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
          <div v-if="error" class="form-error">{{ error }}</div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Отмена
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Сохранение...' : (project ? 'Сохранить' : 'Создать') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 
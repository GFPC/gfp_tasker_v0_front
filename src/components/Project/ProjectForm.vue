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
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">
        {{ project ? 'Редактировать проект' : 'Новый проект' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Название</label>
          <input
            id="name"
            v-model="name"
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
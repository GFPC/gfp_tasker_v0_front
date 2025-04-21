<template>
  <div class="card mb-6">
    <div class="card-header">
      <h2 class="card-title">{{ project.name }}</h2>
      <button @click="$emit('delete')" class="btn btn-danger">
        Удалить проект
      </button>
    </div>

    <p class="text-gray-600 mb-4">{{ project.description }}</p>

    <div class="mb-4">
      <label class="form-label">Статус проекта</label>
      <select v-model="project.status" class="form-select">
        <option value="active">Активный</option>
        <option value="completed">Завершён</option>
        <option value="on_hold">На паузе</option>
      </select>
    </div>

    <div class="mb-4">
      <h3 class="text-lg font-medium mb-2">Участники проекта</h3>
      <div class="flex flex-wrap gap-2">
        <span v-for="member in project.members" 
              :key="member" 
              class="badge badge-info">
          {{ member }}
        </span>
      </div>
    </div>

    <div class="border-t border-gray-200 pt-4">
      <h3 class="text-lg font-medium mb-4">Задачи проекта</h3>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])
</script> 
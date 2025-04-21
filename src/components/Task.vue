<template>
  <div class="card mb-4">
    <div class="card-header">
      <h3 class="card-title">{{ task.title }}</h3>
      <button @click="$emit('delete')" class="btn btn-danger">
        Удалить
      </button>
    </div>
    
    <p class="text-gray-600 mb-4">{{ task.description }}</p>
    
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="form-label">Статус</label>
        <select v-model="task.status" class="form-select">
          <option value="todo">К выполнению</option>
          <option value="in_progress">В работе</option>
          <option value="done">Завершено</option>
        </select>
      </div>
      
      <div>
        <label class="form-label">Приоритет</label>
        <select v-model="task.priority" class="form-select">
          <option value="low">Низкий</option>
          <option value="medium">Средний</option>
          <option value="high">Высокий</option>
        </select>
      </div>
    </div>

    <div class="flex gap-2 mb-4">
      <span :class="[
        'badge',
        {
          'badge-success': task.status === 'done',
          'badge-warning': task.status === 'in_progress',
          'badge-info': task.status === 'todo'
        }
      ]">
        {{ statusText }}
      </span>
      <span :class="[
        'badge',
        {
          'badge-danger': task.priority === 'high',
          'badge-warning': task.priority === 'medium',
          'badge-info': task.priority === 'low'
        }
      ]">
        {{ priorityText }}
      </span>
    </div>

    <div class="flex justify-between text-sm text-gray-500">
      <div>
        <span class="font-medium">Исполнитель:</span>
        {{ task.assignee }}
      </div>
      <div>
        <span class="font-medium">Срок:</span>
        {{ new Date(task.dueDate).toLocaleDateString() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

const statusText = computed(() => {
  const statusMap = {
    todo: 'К выполнению',
    in_progress: 'В работе',
    done: 'Завершено'
  }
  return statusMap[props.task.status] || props.task.status
})

const priorityText = computed(() => {
  const priorityMap = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий'
  }
  return priorityMap[props.task.priority] || props.task.priority
})
</script> 
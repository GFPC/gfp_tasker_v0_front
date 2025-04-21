<script setup>
import { ref } from 'vue'
import ProjectForm from './ProjectForm.vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  },
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['success'])

const showProjectForm = ref(false)
const selectedProject = ref(null)

const openProjectForm = (project = null) => {
  selectedProject.value = project
  showProjectForm.value = true
}

const closeProjectForm = () => {
  showProjectForm.value = false
  selectedProject.value = null
}

const handleProjectSuccess = () => {
  emit('success')
  closeProjectForm()
}

const projectTasks = (projectId) => {
  return props.tasks.filter(task => task.project_id === projectId)
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="projects.length === 0" class="text-center py-12">
      <p class="text-tertiary">Нет проектов</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="card"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-semibold text-primary">{{ project.name }}</h3>
            <p class="text-secondary mt-1">{{ project.description }}</p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="openProjectForm(project)"
              class="btn btn-secondary"
            >
              Редактировать
            </button>
          </div>
        </div>

        <div class="mt-4">
          <h4 class="text-lg font-medium text-primary mb-2">Задачи проекта</h4>
          <div v-if="projectTasks(project.id).length === 0" class="text-tertiary">
            Нет задач
          </div>
          <div v-else class="space-y-2">
            <div 
              v-for="task in projectTasks(project.id)" 
              :key="task.id"
              class="bg-tertiary rounded p-3"
            >
              <div class="flex justify-between items-center">
                <div>
                  <h5 class="font-medium text-primary">{{ task.title }}</h5>
                  <p class="text-sm text-secondary">{{ task.description }}</p>
                </div>
                <span 
                  class="badge"
                  :class="{
                    'badge-success': task.status === 'completed',
                    'badge-warning': task.status === 'in_progress',
                    'badge-danger': task.status === 'pending'
                  }"
                >
                  {{ task.status === 'completed' ? 'Завершена' : 
                     task.status === 'in_progress' ? 'В работе' : 'Ожидает' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Форма проекта -->
  <ProjectForm
    v-if="showProjectForm"
    :project="selectedProject"
    @close="closeProjectForm"
    @success="handleProjectSuccess"
  />
</template> 
<script setup>
import { ref } from 'vue'
import ProjectForm from './ProjectForm.vue'

const props = defineProps({
  projects: {
    type: Array,
    required: true,
    default: () => []
  },
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['success'])

const showProjectForm = ref(false)
const editingProject = ref(null)

const openProjectForm = (project = null) => {
  editingProject.value = project
  showProjectForm.value = true
}

const closeProjectForm = () => {
  showProjectForm.value = false
  editingProject.value = null
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
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-primary">Projects</h2>
      <button @click="openProjectForm()" class="btn btn-primary">
        New Project
      </button>
    </div>

    <div v-if="projects.length === 0" class="text-center py-8">
      <p class="text-tertiary">No projects yet. Create your first project!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="card p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-primary">{{ project.name }}</h3>
          <button
            @click="openProjectForm(project)"
            class="btn btn-secondary"
          >
            Edit
          </button>
        </div>
        <p class="text-secondary mb-4">{{ project.description }}</p>
        <div class="border-t border-border pt-4">
          <h4 class="text-sm font-medium text-primary mb-2">Tasks</h4>
          <div v-if="projectTasks(project.id).length === 0" class="text-tertiary text-sm">
            No tasks in this project
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="task in projectTasks(project.id)"
              :key="task.id"
              class="bg-tertiary p-3 rounded-lg"
            >
              <div class="flex justify-between items-start">
                <h5 class="font-medium text-primary">{{ task.title }}</h5>
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
              </div>
              <p class="text-secondary text-sm mt-1">{{ task.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProjectForm
      v-if="showProjectForm"
      :project="editingProject"
      @success="handleProjectSuccess"
      @close="closeProjectForm"
    />
  </div>
</template> 
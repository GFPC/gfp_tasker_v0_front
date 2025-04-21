import axios from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../constants/api'

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерцептор для обработки токенов
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Добавляем интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (credentials) => {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    return api.post(API_ENDPOINTS.AUTH.LOGIN, formData)
  },
  register: (userData) => api.post(API_ENDPOINTS.AUTH.REGISTER, userData),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  getCurrentUser: () => api.get(API_ENDPOINTS.AUTH.ME),
}

// Projects
export const projectsApi = {
  getAll: () => api.get(API_ENDPOINTS.PROJECTS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.PROJECTS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.PROJECTS.ALL, data),
  update: (id, data) => api.put(API_ENDPOINTS.PROJECTS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.PROJECTS.BY_ID(id)),
  getMembers: (id) => api.get(API_ENDPOINTS.PROJECTS.MEMBERS(id)),
}

// Tasks
export const tasksApi = {
  getAll: () => api.get(API_ENDPOINTS.TASKS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.TASKS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.TASKS.ALL, data),
  update: (id, data) => api.put(API_ENDPOINTS.TASKS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.TASKS.BY_ID(id)),
  assign: (id, userId) => api.put(API_ENDPOINTS.TASKS.ASSIGN(id), null, {
    params: { assignee_id: userId }
  }),
  updateStatus: (id, status) => api.put(API_ENDPOINTS.TASKS.STATUS(id), null, {
    params: { status }
  }),
}

// Users
export const usersApi = {
  getMe: () => api.get(API_ENDPOINTS.USERS.ME),
  getAll: () => api.get(API_ENDPOINTS.USERS.ALL),
}

// Comments
export const commentsApi = {
  create: (taskId, commentData) => api.post(API_ENDPOINTS.COMMENTS.TASK_COMMENTS(taskId), commentData),
  update: (id, commentData) => api.put(API_ENDPOINTS.COMMENTS.BY_ID(id), commentData),
  delete: (id) => api.delete(API_ENDPOINTS.COMMENTS.BY_ID(id)),
}

// Attachments
export const attachmentsApi = {
  upload: (taskId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(API_ENDPOINTS.ATTACHMENTS.TASK_ATTACHMENTS(taskId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  delete: (id) => api.delete(API_ENDPOINTS.ATTACHMENTS.BY_ID(id)),
}

// Notifications
export const notificationsApi = {
  getAll: () => api.get(API_ENDPOINTS.NOTIFICATIONS),
  markAsRead: (id) => api.post(API_ENDPOINTS.MARK_NOTIFICATION_READ(id)),
  markAllAsRead: () => api.post(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ),
}

export default api 
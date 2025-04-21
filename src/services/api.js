import axios from 'axios'
import { API_ENDPOINTS } from '../constants/api'

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
}

// Projects
export const projectsApi = {
  getAll: () => api.get(API_ENDPOINTS.PROJECTS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.PROJECTS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.PROJECTS.ALL, data),
  update: (id, data) => api.put(API_ENDPOINTS.PROJECTS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.PROJECTS.BY_ID(id)),
  getMembers: (id) => api.get(API_ENDPOINTS.PROJECTS.MEMBERS(id))
}

// Tasks
export const tasksApi = {
  getAll: () => api.get(API_ENDPOINTS.TASKS.ALL),
  getById: (id) => api.get(API_ENDPOINTS.TASKS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.TASKS.ALL, data),
  update: (id, data) => api.put(API_ENDPOINTS.TASKS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.TASKS.BY_ID(id)),
  assign: (id, userId) => api.post(API_ENDPOINTS.TASKS.ASSIGN(id), { user_id: userId }),
  updateStatus: (id, status) => api.post(API_ENDPOINTS.TASKS.STATUS(id), { status })
}

// Users
export const usersApi = {
  getMe: () => api.get(API_ENDPOINTS.USERS.ME),
  getAll: () => api.get(API_ENDPOINTS.USERS.ALL)
}

// Comments
export const commentsApi = {
  create: (taskId, commentData) => api.post(API_ENDPOINTS.TASK_COMMENTS(taskId), commentData),
  update: (id, commentData) => api.put(API_ENDPOINTS.COMMENT(id), commentData),
  delete: (id) => api.delete(API_ENDPOINTS.COMMENT(id)),
}

// Attachments
export const attachmentsApi = {
  upload: (taskId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(API_ENDPOINTS.TASK_ATTACHMENTS(taskId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  delete: (id) => api.delete(API_ENDPOINTS.ATTACHMENT(id)),
}

// Notifications
export const notificationsApi = {
  getAll: () => api.get(API_ENDPOINTS.NOTIFICATIONS),
  markAsRead: (id) => api.post(API_ENDPOINTS.MARK_NOTIFICATION_READ(id)),
  markAllAsRead: () => api.post(API_ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ),
}

export default api 
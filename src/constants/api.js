export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/token',
    LOGOUT: '/logout',
    ME: '/users/me'
  },
  PROJECTS: {
    ALL: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    MEMBERS: (id) => `/projects/${id}/members`
  },
  TASKS: {
    ALL: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
    ASSIGN: (id) => `/tasks/${id}/assign`,
    STATUS: (id) => `/tasks/${id}/status`
  },
  USERS: {
    ME: '/users/me',
    ALL: '/users'
  },
  COMMENTS: {
    BY_ID: (id) => `/comments/${id}`,
    TASK_COMMENTS: (taskId) => `/tasks/${taskId}/comments`
  },
  ATTACHMENTS: {
    BY_ID: (id) => `/attachments/${id}`,
    TASK_ATTACHMENTS: (taskId) => `/tasks/${taskId}/attachments`
  },
  NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/mark-as-read`,
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/mark-all-as-read'
} 
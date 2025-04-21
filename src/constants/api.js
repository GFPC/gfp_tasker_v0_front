export const API_BASE_URL = 'https://gfp-tasker-v0.onrender.com/'

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/token',
    LOGOUT: '/logout'
  },
  USERS: {
    ME: '/users/me',
    ALL: '/users'
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
  
  // Comments
  TASK_COMMENTS: (taskId) => `/tasks/${taskId}/comments`,
  COMMENT: (id) => `/comments/${id}`,
  
  // Attachments
  TASK_ATTACHMENTS: (taskId) => `/tasks/${taskId}/attachments`,
  ATTACHMENT: (id) => `/attachments/${id}`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION: (id) => `/notifications/${id}`,
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/read-all'
} 
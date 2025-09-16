import axios from 'axios'

// Extend ImportMeta interface for Vite environment variables
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string
    }
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'Token:', token ? 'exists' : 'missing');
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for logging and auth handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, clearing auth data...');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials).then(res => res.data),
  register: (userData: { email: string; password: string; firstName: string; lastName: string; role?: string }) =>
    api.post('/auth/register', userData).then(res => res.data),
  me: () => api.get('/auth/me').then(res => res.data),
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }).then(res => res.data),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users').then(res => res.data),
  getById: (id: string) => api.get(`/users/${id}`).then(res => res.data),
  create: (data: any) => api.post('/users', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/users/${id}`).then(res => res.data),
  uploadAvatar: (id: string, formData: FormData) => api.post(`/users/${id}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data),
};

// Clients API
export const clientsAPI = {
  getAll: () => api.get('/clients').then(res => res.data),
  getById: (id: string) => api.get(`/clients/${id}`).then(res => res.data),
  create: (data: any) => api.post('/clients', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/clients/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/clients/${id}`).then(res => res.data),
  getStats: () => api.get('/clients/stats').then(res => res.data),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects').then(res => res.data),
  getById: (id: string) => api.get(`/projects/${id}`).then(res => res.data),
  create: (data: any) => api.post('/projects', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/projects/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/projects/${id}`).then(res => res.data),
  getStats: () => api.get('/projects/stats').then(res => res.data),
  getAutomaticStatus: (id: string) => api.get(`/projects/${id}/automatic-status`).then(res => res.data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/projects/stats').then(res => res.data),
  getClientStats: () => api.get('/clients/stats').then(res => res.data),
  getProjectStats: () => api.get('/projects/stats').then(res => res.data),
};

// Materials API
export const materialsAPI = {
  getAll: () => api.get('/materials').then(res => res.data),
  getById: (id: string) => api.get(`/materials/${id}`).then(res => res.data),
  create: (data: any) => api.post('/materials', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/materials/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/materials/${id}`).then(res => res.data),
  getByProject: (projectId: string) => api.get(`/materials/project/${projectId}`).then(res => res.data),
  addToProject: (projectId: string, data: any) => api.post(`/materials/project/${projectId}`, data).then(res => res.data),
  removeFromProject: (projectId: string, materialId: string) => api.delete(`/materials/project/${projectId}/${materialId}`).then(res => res.data),
  getStats: () => api.get('/materials/stats').then(res => res.data),
};

// Files API
export const filesAPI = {
  getAll: () => api.get('/files').then(res => res.data),
  getById: (id: string) => api.get(`/files/${id}`).then(res => res.data),
  upload: (formData: FormData) => api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data),
  delete: (id: string) => api.delete(`/files/${id}`).then(res => res.data),
  getByProject: (projectId: string) => api.get(`/files/project/${projectId}`).then(res => res.data),
};

// File Comments API
export const fileCommentsAPI = {
  getByFile: (fileId: string) => api.get(`/files/${fileId}/comments`).then(res => res.data),
  create: (fileId: string, data: { content: string; parentId?: string }) => 
    api.post(`/files/${fileId}/comments`, data).then(res => res.data),
  delete: (fileId: string, commentId: string) => 
    api.delete(`/files/${fileId}/comments/${commentId}`).then(res => res.data),
};

// Messages API
export const messagesAPI = {
  getAll: () => api.get('/messages').then(res => res.data),
  getById: (id: string) => api.get(`/messages/${id}`).then(res => res.data),
  create: (data: any) => api.post('/messages', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/messages/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/messages/${id}`).then(res => res.data),
  getByProject: (projectId: string) => api.get(`/messages/project/${projectId}`).then(res => res.data),
  
  // File Attachments
  attachFile: (messageId: string, formData: FormData) => 
    api.post(`/messages/${messageId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
  getAttachments: (messageId: string) => 
    api.get(`/messages/${messageId}/attachments`).then(res => res.data),
  removeAttachment: (messageId: string, fileId: string) => 
    api.delete(`/messages/${messageId}/attachments/${fileId}`).then(res => res.data),
  getProjectFilesFromMessages: (projectId: string) => 
    api.get(`/messages/project/${projectId}/files-from-messages`).then(res => res.data),
};

// Project Templates API
export const projectTemplatesAPI = {
  getAll: () => api.get('/project-templates').then(res => res.data),
  getById: (id: string) => api.get(`/project-templates/${id}`).then(res => res.data),
  create: (data: any) => api.post('/project-templates', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/project-templates/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/project-templates/${id}`).then(res => res.data),
  addStep: (templateId: string, data: any) => api.post(`/project-templates/${templateId}/steps`, data).then(res => res.data),
  updateStep: (templateId: string, stepId: string, data: any) => api.patch(`/project-templates/${templateId}/steps/${stepId}`, data).then(res => res.data),
  deleteStep: (templateId: string, stepId: string) => api.delete(`/project-templates/${templateId}/steps/${stepId}`).then(res => res.data),
  applyToProject: (templateId: string, projectId: string) => api.post(`/project-templates/${templateId}/apply/${projectId}`).then(res => res.data),
};

// Project Steps API
export const projectStepsAPI = {
  getAll: () => api.get('/project-steps').then(res => res.data),
  getById: (id: string) => api.get(`/project-steps/${id}`).then(res => res.data),
  create: (data: any) => api.post('/project-steps', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/project-steps/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/project-steps/${id}`).then(res => res.data),
  getByProject: (projectId: string) => api.get(`/project-steps/project/${projectId}`).then(res => res.data),
  updateTask: (taskId: string, data: any) => api.patch(`/tasks/${taskId}`, data).then(res => res.data),
  deleteTask: (taskId: string) => api.delete(`/tasks/${taskId}`).then(res => res.data),
};

// Tasks API
export const tasksAPI = {
  getAll: () => api.get('/tasks').then(res => res.data),
  getByStep: (stepId: string) => api.get(`/tasks/step/${stepId}`).then(res => res.data),
  getById: (id: string) => api.get(`/tasks/${id}`).then(res => res.data),
  create: (data: any) => api.post('/tasks', data).then(res => res.data),
  update: (id: string, data: any) => api.patch(`/tasks/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/tasks/${id}`).then(res => res.data),
  addMaterials: (taskId: string, materials: { materialId: string; quantity: number }[]) => 
    api.post(`/tasks/${taskId}/materials`, { materials }).then(res => res.data),
  getMaterials: (taskId: string) => api.get(`/tasks/${taskId}/materials`).then(res => res.data),
  removeMaterial: (taskId: string, materialId: string) => 
    api.delete(`/tasks/${taskId}/materials/${materialId}`).then(res => res.data),
};

// Company Settings API
export const companySettingsAPI = {
  get: () => api.get('/company-settings').then(res => res.data),
  create: (data: any) => api.post('/company-settings', data).then(res => res.data),
  update: (data: any) => api.patch('/company-settings', data).then(res => res.data),
  delete: () => api.delete('/company-settings').then(res => res.data),
};

export default api;

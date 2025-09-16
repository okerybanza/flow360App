export interface CompanySettings {
  id: string
  name: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  fontFamily: string
  fontSize: string
  email?: string
  phone?: string
  address?: string
  website?: string
  currency: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  jobTitle?: string
  department?: string
  bio?: string
  skills?: string
  experience?: string
  certifications?: string
  linkedinUrl?: string
  website?: string
  timezone?: string
  language?: string
  role: 'ADMIN' | 'ARCHITECT' | 'CLIENT'
  createdAt: string
  updatedAt: string
}

export interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE';
  type: 'INDIVIDUAL' | 'COMPANY';
  companyName?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  projects?: Project[];
  _count: {
    projects: number;
  };
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SUSPENDED';
  budget?: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: 'INDIVIDUAL' | 'COMPANY';
    companyName?: string;
  };
  members: User[];
  _count: {
    materials: number;
    files: number;
    messages: number;
  };
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface File {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalProjects: number;
  totalProjectsStats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
    materialsCount: number;
  };
}

// Project Templates Types
export interface ProjectTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  steps: ProjectTemplateStep[];
}

export interface ProjectTemplateStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  tasks: ProjectTemplateTask[];
}

export interface ProjectTemplateTask {
  id: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Project Steps Types
export interface ProjectStep {
  id: string;
  title: string;
  description?: string;
  order: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED' | 'SUSPENDED';
  startDate?: string;
  endDate?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  estimatedDuration?: number; // in days
  actualDuration?: number; // in days
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  order: number;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'BLOCKED' | 'SUSPENDED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignee?: User;
  createdBy: string;
  creator: User;
  taskMaterials: TaskMaterial[];
}

// Task Material Types
export interface TaskMaterial {
  id: string;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  materialId: string;
  material: Material;
  taskId: string;
}

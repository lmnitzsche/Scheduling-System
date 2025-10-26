export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  userId?: string
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
}

export interface UpdateTaskInput {
  id: string
  title?: string
  description?: string
  priority?: 'low' | 'medium' | 'high'
  dueDate?: string
  completed?: boolean
}
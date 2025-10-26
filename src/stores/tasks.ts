import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const authStore = useAuthStore()

  const completedTasks = computed(() => 
    tasks.value.filter(task => task.completed)
  )
  
  const pendingTasks = computed(() => 
    tasks.value.filter(task => !task.completed)
  )

  const todayTasks = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.value.filter(task => 
      task.dueDate && task.dueDate.startsWith(today)
    )
  })

  const overdueTasks = computed(() => {
    const now = new Date().toISOString()
    return tasks.value.filter(task => 
      task.dueDate && task.dueDate < now && !task.completed
    )
  })

  const setError = (message: string) => {
    error.value = message
    setTimeout(() => {
      error.value = null
    }, 5000)
  }

  const loadTasks = async () => {
    if (!authStore.user) {
      tasks.value = getGuestTasks()
      return
    }

    loading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      tasks.value = data || []
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks')
      console.error('Load tasks error:', err)
    } finally {
      loading.value = false
    }
  }

  const createTask = async (input: CreateTaskInput) => {
    loading.value = true
    error.value = null

    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...input,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: authStore.user?.id
      }

      if (authStore.user) {
        const { data, error: supabaseError } = await supabase
          .from('tasks')
          .insert({
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            priority: newTask.priority,
            due_date: newTask.dueDate,
            completed: newTask.completed,
            user_id: newTask.userId,
            created_at: newTask.createdAt,
            updated_at: newTask.updatedAt
          })
          .select()
          .single()

        if (supabaseError) throw supabaseError
      } else {
        // Guest mode - save to localStorage
        saveGuestTask(newTask)
      }

      tasks.value.unshift(newTask)
    } catch (err: any) {
      setError(err.message || 'Failed to create task')
      console.error('Create task error:', err)
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (input: UpdateTaskInput) => {
    loading.value = true
    error.value = null

    try {
      const taskIndex = tasks.value.findIndex(t => t.id === input.id)
      if (taskIndex === -1) throw new Error('Task not found')

      const updatedTask = {
        ...tasks.value[taskIndex],
        ...input,
        updatedAt: new Date().toISOString()
      }

      if (authStore.user) {
        const { error: supabaseError } = await supabase
          .from('tasks')
          .update({
            title: updatedTask.title,
            description: updatedTask.description,
            priority: updatedTask.priority,
            due_date: updatedTask.dueDate,
            completed: updatedTask.completed,
            updated_at: updatedTask.updatedAt
          })
          .eq('id', input.id)

        if (supabaseError) throw supabaseError
      } else {
        // Guest mode
        updateGuestTask(updatedTask)
      }

      tasks.value[taskIndex] = updatedTask
    } catch (err: any) {
      setError(err.message || 'Failed to update task')
      console.error('Update task error:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      if (authStore.user) {
        const { error: supabaseError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)

        if (supabaseError) throw supabaseError
      } else {
        // Guest mode
        deleteGuestTask(id)
      }

      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err: any) {
      setError(err.message || 'Failed to delete task')
      console.error('Delete task error:', err)
    } finally {
      loading.value = false
    }
  }

  // Guest mode helpers
  const getGuestTasks = (): Task[] => {
    try {
      const stored = localStorage.getItem('guest_tasks')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveGuestTask = (task: Task) => {
    const current = getGuestTasks()
    current.unshift(task)
    localStorage.setItem('guest_tasks', JSON.stringify(current))
  }

  const updateGuestTask = (task: Task) => {
    const current = getGuestTasks()
    const index = current.findIndex(t => t.id === task.id)
    if (index !== -1) {
      current[index] = task
      localStorage.setItem('guest_tasks', JSON.stringify(current))
    }
  }

  const deleteGuestTask = (id: string) => {
    const current = getGuestTasks()
    const filtered = current.filter(t => t.id !== id)
    localStorage.setItem('guest_tasks', JSON.stringify(filtered))
  }

  return {
    tasks,
    loading,
    error,
    completedTasks,
    pendingTasks,
    todayTasks,
    overdueTasks,
    loadTasks,
    createTask,
    updateTask,
    deleteTask
  }
})
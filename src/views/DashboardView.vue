<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">TaskMaster</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              {{ authStore.user ? authStore.user.email : 'Guest User' }}
            </span>
            
            <button
              v-if="authStore.user"
              @click="signOut"
              class="btn-secondary text-sm"
            >
              Sign Out
            </button>
            <router-link
              v-else
              to="/login"
              class="btn-primary text-sm"
            >
              Sign In
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-primary-100 rounded-lg">
              <ClipboardDocumentListIcon class="h-6 w-6 text-primary-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Tasks</p>
              <p class="text-2xl font-semibold text-gray-900">{{ taskStore.tasks.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-success-100 rounded-lg">
              <CheckCircleIcon class="h-6 w-6 text-success-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-semibold text-gray-900">{{ taskStore.completedTasks.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-warning-100 rounded-lg">
              <ClockIcon class="h-6 w-6 text-warning-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Today</p>
              <p class="text-2xl font-semibold text-gray-900">{{ taskStore.todayTasks.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 bg-danger-100 rounded-lg">
              <ExclamationTriangleIcon class="h-6 w-6 text-danger-600" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Overdue</p>
              <p class="text-2xl font-semibold text-gray-900">{{ taskStore.overdueTasks.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Management -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Task Form -->
        <div class="lg:col-span-1">
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
            
            <form @submit.prevent="createTask" class="space-y-4">
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  v-model="newTask.title"
                  type="text"
                  required
                  class="input mt-1"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  v-model="newTask.description"
                  rows="3"
                  class="input mt-1"
                  placeholder="Enter task description"
                ></textarea>
              </div>

              <div>
                <label for="priority" class="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  v-model="newTask.priority"
                  class="input mt-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label for="dueDate" class="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  v-model="newTask.dueDate"
                  type="datetime-local"
                  class="input mt-1"
                />
              </div>

              <button
                type="submit"
                :disabled="taskStore.loading || !newTask.title.trim()"
                class="btn-primary w-full"
              >
                <span v-if="!taskStore.loading">Add Task</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Task List -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-gray-900">Tasks</h2>
              <div class="flex space-x-2">
                <button
                  @click="filter = 'all'"
                  :class="[
                    'px-3 py-1 text-sm rounded-md',
                    filter === 'all' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  All
                </button>
                <button
                  @click="filter = 'pending'"
                  :class="[
                    'px-3 py-1 text-sm rounded-md',
                    filter === 'pending' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  Pending
                </button>
                <button
                  @click="filter = 'completed'"
                  :class="[
                    'px-3 py-1 text-sm rounded-md',
                    filter === 'completed' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
                  ]"
                >
                  Completed
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="taskStore.error" class="mb-4 bg-danger-50 border border-danger-200 rounded-lg p-4">
              <p class="text-sm text-danger-800">{{ taskStore.error }}</p>
            </div>

            <!-- Tasks -->
            <div class="space-y-3">
              <div
                v-for="task in filteredTasks"
                :key="task.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    :checked="task.completed"
                    @change="toggleTask(task)"
                    class="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  
                  <div class="flex-1">
                    <h3 :class="[
                      'font-medium',
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    ]">
                      {{ task.title }}
                    </h3>
                    <p v-if="task.description" :class="[
                      'text-sm',
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    ]">
                      {{ task.description }}
                    </p>
                    <div class="flex items-center space-x-3 mt-1">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        task.priority === 'high' ? 'bg-danger-100 text-danger-800' :
                        task.priority === 'medium' ? 'bg-warning-100 text-warning-800' :
                        'bg-gray-100 text-gray-800'
                      ]">
                        {{ task.priority }}
                      </span>
                      <span v-if="task.dueDate" class="text-xs text-gray-500">
                        Due: {{ formatDate(task.dueDate) }}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  @click="deleteTask(task.id)"
                  class="text-gray-400 hover:text-danger-600 ml-4"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>

              <div v-if="filteredTasks.length === 0" class="text-center py-8 text-gray-500">
                <ClipboardDocumentListIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ filter === 'all' ? 'Get started by creating a new task.' : `No ${filter} tasks found.` }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useTaskStore } from '@/stores/tasks'
import type { CreateTaskInput } from '@/types'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const filter = ref<'all' | 'pending' | 'completed'>('all')

const newTask = ref<CreateTaskInput>({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: ''
})

const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'pending':
      return taskStore.pendingTasks
    case 'completed':
      return taskStore.completedTasks
    default:
      return taskStore.tasks
  }
})

const createTask = async () => {
  if (!newTask.value.title.trim()) return

  await taskStore.createTask({
    ...newTask.value,
    dueDate: newTask.value.dueDate || undefined
  })

  // Reset form
  newTask.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  }
}

const toggleTask = async (task: any) => {
  await taskStore.updateTask({
    id: task.id,
    completed: !task.completed
  })
}

const deleteTask = async (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await taskStore.deleteTask(id)
  }
}

const signOut = async () => {
  await authStore.signOut()
  router.push('/login')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  taskStore.loadTasks()
})
</script>
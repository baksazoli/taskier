<template>
  <v-card flat color="transparent">
    <!-- Header Section -->
    <div class="sticky-header">
      <v-toolbar flat color="transparent" elevation="1" height="auto">
        <v-container class="px-0 mx-5">
          <v-row align="center" justify="center">
            <v-col cols="12" md="2">
              <v-btn data-test="new-task-button" color="primary" prepend-icon="mdi-plus" @click="openModal">
                New Task
              </v-btn>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field append-inner-icon="mdi-magnify" v-model="searchQuery" label="Search by description" dense />
            </v-col>

            <v-col cols="12" md="4">
              <v-select v-model="isCompletedFilter" :items="filterOptions" label="Filter by completion" dense />
            </v-col>
          </v-row>
        </v-container>
      </v-toolbar>
    </div>

    <div style="height:1px;padding-top:10px;">
      <div v-if="!isSelectionEmpty" class="selection-actions pa-2 pl-5">
        <div class="d-flex flex-wrap align-center">
          <div data-test="used-estimated-container" class="time-summary">
            Time used/estimated for selected tasks:
            {{ selectedTotal.used }} / {{ selectedTotal.estimated }} minutes
          </div>

          <div class="action-buttons ml-5">
            <v-btn data-test="bulk-delete-button" density="compact" variant="plain" size="large" @click="confirmAction('bulkDeleteTasks')">
              <v-tooltip activator="parent" location="bottom">
                Delete selected tasks
              </v-tooltip>
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn density="compact" variant="plain" @click="confirmAction('bulkCompleteTasks')">
              <v-tooltip activator="parent" location="bottom">
                Set selected tasks to completed
              </v-tooltip>
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- Table Section -->
    <div class="table-container mt-12">
      <v-data-table v-model="selected" :headers="headers" :items="filteredTasks" height="calc(100vh - 250px)"
        fixed-header :items-per-page="50" item-value="id" show-select>
        <template #item.created_at="{ item }">
          {{ date.format(item.created_at, 'keyboardDateTime24h') }}
        </template>
        <template #item.completed_at="{ item }">
          <v-icon :color="item.completed_at ? 'green' : 'red'">
            {{ item.completed_at ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </template>

        <template #item.actions="{ item }">
          <v-btn data-test="edit-button" density="compact" variant="plain" size="large" @click="openEditModal(item)">
            <v-tooltip activator="parent" location="bottom">
              Edit task
            </v-tooltip>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-btn density="compact" variant="plain" size="large" @click="confirmDeleteTaskAction(item.id)">
            <v-tooltip activator="parent" location="bottom">
              Delete task
            </v-tooltip>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>

    <!-- Dialogs -->
    <v-dialog v-model="dialog" max-width="500">
      <task-form :task="editingTask" @close="closeModal" />
    </v-dialog>

    <v-dialog v-model="confirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h8">
          {{ confirmMessage }}
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" text @click="confirmDialog = false">
            Cancel
          </v-btn>
          <v-btn color="green" text @click="executeAction">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.isVisible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<style scoped>
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 100px;
}

.v-app-bar :deep(.v-toolbar__content) {
  justify-content: flex-start;
  padding-left: 0;
  padding-top: 10px;
}

.table-container {
  margin-top: 100px;
}

.selection-actions {
  min-height: 35px;
}

.time-summary {
  padding-top: 4px;
}

.v-btn {
  min-width: 0;
  padding: 4px;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, provide, inject } from 'vue';
import { useTaskStore } from '@/stores/useTaskStore';
import TaskForm from '@/components/TaskForm.vue';
import { useDate } from 'vuetify'
import type { Task } from "@/models/Task";

type ActionType = 'deleteTask' | 'bulkDeleteTasks' | 'bulkCompleteTasks';
type CompletionFilter = 'all' | 'completed' | 'notCompleted';

const store = useTaskStore();

// Refs
const selected = ref<number[]>([]);
const dialog = ref(false);
const confirmDialog = ref(false);
const actionType = ref<ActionType | null>(null);
const editingTask = ref(null);
const searchQuery = ref('');
const isCompletedFilter = ref<CompletionFilter>('all');
const date = useDate();

const snackbar = reactive({
  isVisible: false,
  message: '',
  color: 'success',
  show: (message: string, color = 'success') => {
    snackbar.message = message;
    snackbar.color = color;
    snackbar.isVisible = true;
  }
});

provide('snackbar', snackbar);

const rules = [
  value => {
    if (value) return true
    return 'You must enter a first name.'
  },
]


// Constants
const filterOptions = [
  { title: 'All', value: 'all' },
  { title: 'Completed', value: 'completed' },
  { title: 'Not completed', value: 'notCompleted' }
];

const headers = [
  { title: 'Created At', key: 'created_at' },
  { title: 'Assignee', key: 'user.name' },
  { title: 'Description', key: 'description' },
  { title: 'Estimated Time (minute)', key: 'estimated_time' },
  { title: 'Used Time (minute)', key: 'used_time' },
  { title: 'Completed', key: 'completed_at' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Computed
const tasks = computed<Task[]>(() => store.tasks);
const isSelectionEmpty = computed(() => selected.value.length === 0);

const selectedTotal = computed(() => {
  const selectedTasks = store.tasks.filter(task => selected.value.includes(task.id));
  return {
    estimated: selectedTasks.reduce((sum, task) => sum + task.estimated_time, 0),
    used: selectedTasks.reduce((sum, task) => sum + task.used_time, 0)
  };
});

const filteredTasks = computed<Task[]>(() => {
  return store.tasks.filter((task) => {
    const matchesFilter =
      isCompletedFilter.value === 'all' ||
      (isCompletedFilter.value === 'completed' && task.completed_at) ||
      (isCompletedFilter.value === 'notCompleted' && !task.completed_at);

    const matchesSearch = task.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesFilter && matchesSearch;
  });
});


const confirmMessage = computed(() => {
  if (!actionType.value) return '';

  const count = selected.value.length;
  const taskWord = count === 1 ? 'task' : 'tasks';

  return {
    deleteTask: 'Are you sure you want to delete the task?',
    bulkDeleteTasks: `Are you sure you want to delete ${count} ${taskWord}?`,
    bulkCompleteTasks: `Are you sure you want to mark ${count} ${taskWord} as complete?`
  }[actionType.value];
});

// Methods
const confirmDeleteTaskAction = (taskId) => {
  actionType.value = 'deleteTask';
  selected.value = [taskId];
  confirmDialog.value = true;
};

const confirmAction = (type: ActionType) => {
  if (!isSelectionEmpty.value) {
    actionType.value = type;
    confirmDialog.value = true;
  }
};

const executeAction = async () => {
  if (!actionType.value) return;
  try {
    switch (actionType.value) {
      case 'deleteTask':
        await store.deleteTask(selected.value);
        snackbar.show("Task deleted successfully", "success");
        break;
      case 'bulkDeleteTasks':
        await store.bulkDeleteTasks(selected.value);
        snackbar.show("Selected tasks deleted", "success");
        break;
      case 'bulkCompleteTasks':
        await store.bulkCompleteTasks(selected.value);
        snackbar.show("Selected tasks marked as complete", "success");
        break;
    }
    selected.value = [];
  } catch (error) {
    console.error('Action failed:', error);
    snackbar.show("An error occurred while performing the action", "error");
  } finally {
    confirmDialog.value = false;
  }
};

const openModal = () => {
  editingTask.value = null;
  dialog.value = true;
};

const openEditModal = (task: Task) => {
  editingTask.value = { ...task };
  dialog.value = true;
};

const closeModal = () => {
  dialog.value = false;
  store.fetchTasks();
};

// Lifecycle
onMounted(() => {
  store.fetchTasks();
});
</script>
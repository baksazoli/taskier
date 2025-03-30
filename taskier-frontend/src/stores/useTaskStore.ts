import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { taskService } from "@/services/TaskService";
import type { Task } from "@/models/Task";

export const useTaskStore = defineStore("task", () => {
  const tasks = ref<Task[]>([]);

  const fetchTasks = async () => {
    tasks.value = await taskService.getAll();
  };

  const deleteTask = async (taskIds: number[]) => {
    await taskService.delete(taskIds);
    await fetchTasks();
  };

  const updateTask = async (taskId: number, data: Partial<Task>) => {
    await taskService.update(taskId, data);
    await fetchTasks();
  };

  const bulkDeleteTasks = async (taskIds: number[]) => {
    await taskService.bulkDeleteTasks(taskIds);
    await fetchTasks();
  };

  const bulkCompleteTasks = async (taskIds: number[]) => {
    await taskService.bulkCompleteTasks(taskIds);
    await fetchTasks();
  };

  const totalTime = computed(() => {
    return {
      used: tasks.value.reduce((sum, task) => sum + (task.used_time || 0), 0),
      estimated: tasks.value.reduce((sum, task) => sum + (task.estimated_time || 0), 0),
    };
  });

  return {
    tasks,
    fetchTasks,
    deleteTask,
    updateTask,
    bulkDeleteTasks,
    bulkCompleteTasks,
    totalTime,
  };
});
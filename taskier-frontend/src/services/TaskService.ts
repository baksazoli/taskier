import axios from "axios";
import type { Task } from "@/models/Task";

const API_URL = "http://localhost/api";

export const taskService = {
  getAll: async (): Promise<Task[]> => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  },
  create: (data: Omit<Task, 'id' | 'created_at' | 'completed_at'>) => axios.post(`${API_URL}/tasks`, data),
  update: (id: number, data: Partial<Task>) => axios.patch(`${API_URL}/tasks/${id}`, data),
  delete: (id: number) => axios.delete(`${API_URL}/tasks/${id}`),
  bulkCompleteTasks: (ids: number[]) => axios.patch(`${API_URL}/tasks/bulk/complete`, { ids }),
  bulkDeleteTasks: (ids: number[]) => axios.delete(`${API_URL}/tasks/bulk/delete`, { data: { ids } }),
};

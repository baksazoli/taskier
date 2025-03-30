import { setActivePinia, createPinia } from "pinia";
import { useTaskStore } from "@/stores/useTaskStore";
import { taskService } from "@/services/TaskService";
import { beforeEach, describe, it, expect, vi } from "vitest";

describe.only("useTaskStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("fetches tasks from the service", async () => {
    const mockTasks = [{ id: 1, description: "Task 1" }, { id: 2, description: "Task 2" }];
    taskService.getAll = vi.fn().mockResolvedValue(mockTasks);

    const store = useTaskStore();
    await store.fetchTasks();

    expect(store.tasks).toEqual(mockTasks);
    expect(taskService.getAll).toHaveBeenCalled();
  });

  it("delete task using the service", async () => {
    const mockTaskIds = [1];
    taskService.delete = vi.fn().mockResolvedValue(undefined);
    taskService.getAll = vi.fn().mockResolvedValue([]);

    const store = useTaskStore();
    await store.deleteTask(mockTaskIds);

    expect(taskService.delete).toHaveBeenCalledWith(mockTaskIds);
    expect(taskService.getAll).toHaveBeenCalled();
  });

  it("update task using the service", async () => {
    taskService.update = vi.fn().mockResolvedValue(undefined);
    taskService.getAll = vi.fn().mockResolvedValue([]);

    const store = useTaskStore();
    await store.updateTask(1, {description:'Updated Task Description'});

    expect(taskService.update).toHaveBeenCalledWith(1, {description:'Updated Task Description'});
    expect(taskService.getAll).toHaveBeenCalled();
  });

  it("bulk delete tasks using the service", async () => {
    const mockTaskIds = [1, 2];
    taskService.bulkDeleteTasks = vi.fn().mockResolvedValue(undefined);
    taskService.getAll = vi.fn().mockResolvedValue([]);

    const store = useTaskStore();
    await store.bulkDeleteTasks(mockTaskIds);

    expect(taskService.bulkDeleteTasks).toHaveBeenCalledWith(mockTaskIds);
    expect(taskService.getAll).toHaveBeenCalled();
  });

  it("bulk complete tasks using the service", async () => {
        const mockTaskIds = [1,2];
        taskService.bulkCompleteTasks = vi.fn().mockResolvedValue(undefined);
        taskService.getAll = vi.fn().mockResolvedValue([]);

        const store = useTaskStore();
        await store.bulkCompleteTasks(mockTaskIds);

        expect(taskService.bulkCompleteTasks).toHaveBeenCalledWith(mockTaskIds);
        expect(taskService.getAll).toHaveBeenCalled();
  });

  it("calculates total time correctly", () => {
    const store = useTaskStore();
    store.tasks = [
      { id: 1, description: "Task 1", estimated_time: 10, used_time: 5 },
      { id: 2, description: "Task 2", estimated_time: 20, used_time: 15 },
    ];

    expect(store.totalTime).toEqual({ used: 20, estimated: 30 });
  });
});
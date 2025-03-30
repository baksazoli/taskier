import { mount } from "@vue/test-utils";
import TaskForm from "@/components/TaskForm.vue";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { describe, it, expect, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

describe("TaskForm", () => {
  const vuetify = createVuetify({
    components,
    directives,
  });

  it('displays correct card title based on editing state', () => {
    const wrapperNew = mount(TaskForm, { props: { task: null } });
    expect(wrapperNew.find('v-card-title').text()).toBe('New Task');
    
    const wrapperEdit = mount(TaskForm, { props: { task: { id: 1, description: 'Test task' } } });
    expect(wrapperEdit.find('v-card-title').text()).toBe('Edit Task');
  });

  it('validates the form before submission', async () => {
    const wrapper = mount(TaskForm, { props: { task: null } });
  
    const submitButton = wrapper.find('v-btn[type="submit"]');
    await submitButton.trigger('click');
    
    expect(wrapper.vm.isFormValid).toBe(false);
  });

  it("populates users select with data from userService", async () => {
    const mockUsers = [
      { id: 1, name: "User 1" }, 
      { id: 2, name: "User 2" }
    ];

    vi.spyOn(userService, 'getUsers').mockResolvedValue(mockUsers);

    const wrapper = mount(TaskForm, {
      global: {
        plugins: [vuetify],
      },
    });

    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(userService.getUsers).toHaveBeenCalled();

    const users = (wrapper.vm as any).users;
    expect(users).toHaveLength(2);
    expect(users).toEqual([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" }
    ]);

    const userSelect = wrapper.findComponent({ name: 'v-select' });
    
    expect(userSelect.exists()).toBe(true);
    
    const selectProps = userSelect.props();
    expect(selectProps.items).toHaveLength(2);
    expect(selectProps.items).toEqual([
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" }
    ]);
  });
});
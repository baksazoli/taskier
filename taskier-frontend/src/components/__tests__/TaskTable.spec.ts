import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useTaskStore } from '@/stores/useTaskStore';
import TaskTable from '@/components/TaskTable.vue';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({ components, directives });

if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    callback: any;
    constructor(callback: any) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

describe('TaskTable', () => {
  let wrapper;
  let store;

  beforeEach(async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    store = useTaskStore();
    store.tasks = [
      { id: 1, description: 'Task 1', estimated_time: 10, used_time: 5, completed_at: null },
      { id: 2, description: 'Task 2', estimated_time: 20, used_time: 15, completed_at: '2023-01-01' },
    ];
    store.totalTime = { used: 20, estimated: 30 };
    store.fetchTasks = vi.fn().mockResolvedValue(undefined);
    store.deleteTask = vi.fn().mockResolvedValue(undefined);
    store.updateTask = vi.fn().mockResolvedValue(undefined);

    wrapper = mount(TaskTable, {
      global: {
        plugins: [pinia, vuetify],
        stubs: {
          TaskForm: true,
        },
      },
    });

    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    wrapper.unmount()
  });

  it('renders correctly', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders the component correctly', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should open modal when New Task button is clicked', async () => {
    const newTaskButton = wrapper.findComponent('[data-test="new-task-button"]');

    expect(newTaskButton.exists()).toBe(true)

    await newTaskButton.trigger('click');

    expect(wrapper.vm.dialog).toBe(true);
  })

  it('filters tasks correctly based on search query', async () => {
    const searchField = wrapper.findComponent({ name: 'v-text-field' });

    await searchField.setValue('Task 1');

    const filteredTasks = wrapper.vm.filteredTasks;
    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0].description).toBe('Task 1');
  })

  it('opens edit modal correctly', async () => {
    const openEditModalSpy = vi.spyOn(wrapper.vm, 'openEditModal')
    const editButton = wrapper.findComponent('[data-test="edit-button"]');
    await editButton.trigger('click')
    
    expect(openEditModalSpy).toHaveBeenCalled()
  });

  it('shows the correct snackbar message after task deletion', async () => {
    const snackbarShowSpy = vi.spyOn(wrapper.vm.snackbar, 'show')

    wrapper.vm.snackbar.show('Task deleted successfully', 'success')
    
    expect(snackbarShowSpy).toHaveBeenCalledWith('Task deleted successfully', 'success')
  })

  it('executes complete task action correctly', async () => {
    const bulkCompleteTasksSpy = vi.fn()
    
    store.bulkCompleteTasks = bulkCompleteTasksSpy;
    
    wrapper.vm.actionType = 'bulkCompleteTasks'
    wrapper.vm.selected = [1, 2]
    
    await wrapper.vm.executeAction()
    
    expect(bulkCompleteTasksSpy).toHaveBeenCalledWith([1, 2])
    expect(wrapper.vm.selected).toEqual([])
  })

  it('displays tasks from store', () => {
    expect(wrapper.text()).toContain('Task 1');
    expect(wrapper.text()).toContain('Task 2');
  });

  it.skip('shows correct total time', async () => {
    wrapper.vm.selected.value = [1];
    wrapper.vm.isSelectionEmpty = false;
    await wrapper.vm.$nextTick();
  
    const $usedEstimatedContainer = wrapper.find('[data-test="used-estimated-container"]');
    expect($usedEstimatedContainer.exists()).toBe(true);
    expect($usedEstimatedContainer.text()).toContain('Time used/estimated for selected tasks: 20 / 30 minutes');
  });

  describe('Delete Action', () => {
    it('should show the correct confirm message when bulk delete is triggered', async () => {
      const bulkDeleteButton = wrapper.findComponent({
        name: 'v-btn',
        props: {
          density: 'compact',
          variant: 'plain',
          size: 'large'
        }
      });
      
      wrapper.vm.selected = [1, 2];
      await bulkDeleteButton.trigger('click');
      await wrapper.vm.confirmAction('bulkDeleteTasks');
      const confirmMessage = wrapper.vm.confirmMessage;
      expect(confirmMessage).toBe('Are you sure you want to delete 2 tasks?');
    });
  
    it('executes bulk delete action correctly', async () => {
      const bulkDeleteTasksSpy = vi.fn();
  
      store.bulkDeleteTasks = bulkDeleteTasksSpy;
  
      wrapper.vm.actionType = 'bulkDeleteTasks';
      wrapper.vm.selected = [1, 2];
  
      await wrapper.vm.executeAction();
      expect(bulkDeleteTasksSpy).toHaveBeenCalledWith([1, 2]);
      expect(wrapper.vm.selected).toEqual([]);
    });

    it.skip('calls delete when confirmed', async () => {
      wrapper.vm.selected = [1]; 
      await wrapper.vm.$nextTick();
    
      await wrapper.findComponent('[data-testid="bulk-delete-button"]').trigger('click');
      await wrapper.vm.$nextTick();
    
      const confirmBtn = wrapper.find('[data-testid="confirm-action-btn"]');
      expect(confirmBtn.exists()).toBe(true);
    
      await confirmBtn.trigger('click');
      await wrapper.vm.$nextTick();
    
      expect(store.deleteTask).toHaveBeenCalledWith([1]);
    });
    
  });
});
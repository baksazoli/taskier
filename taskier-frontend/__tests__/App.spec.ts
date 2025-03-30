import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import { describe, it, expect } from 'vitest';

describe.skip('App', () => {
  it('renders TaskTable component', () => {
    const wrapper = mount(App);
    expect(wrapper.findComponent({ name: 'taskTable' }).exists()).toBe(true);
  });
}); 
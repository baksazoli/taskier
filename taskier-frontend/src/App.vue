<template>
  <v-app>
    <v-main>
      <taskTable ref="taskTable" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import taskTable from './components/taskTable.vue';

export default defineComponent({
  components: {
    taskTable,
  },
  methods: {
    fetchTasks() {
      (this.$refs.taskTable as any).fetchTasks();
    },
    fetchUsers() {
      (this.$refs.taskTable as any).fetchUsers();
    },
  },
});
</script>
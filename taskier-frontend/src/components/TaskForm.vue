<template>
  <v-card>
    <v-card-title>{{ isEditing ? "Edit Task" : "New Task" }}</v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent="submit" v-model="isFormValid">
        <v-select
          v-model="localTask.user_id"
          label="User"
          :items="users"
          item-title="name"
          item-value="id"
          required
        ></v-select>
        <v-text-field
          data-test="description-field"
          v-model="localTask.description"
          label="Description"
          required
          :rules="[rules.required, rules.minLength]"
        />
        <v-text-field
          v-model="localTask.estimated_time"
          label="Estimated time"
          type="number"
          required
          :rules="[rules.required, rules.minValue]"
        />
        <v-text-field
          v-model="localTask.used_time"
          label="Used time"
          type="number"
          required
          :rules="[rules.cannotBeNegative]"
        />
        <v-card-actions class="d-flex justify-end">
          <v-btn color="red" @click="emit('close')">Cancel</v-btn>
          <v-btn type="submit" color="primary" :disabled="!isFormValid">{{ isEditing ? "Update" : "Save" }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits, computed, inject } from "vue";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";

const snackbar = inject("snackbar");

const props = defineProps({
  task: Object,
});
const emit = defineEmits(["close", "saved"]);

const localTask = ref({
  id: props.task?.id || null,
  description: props.task?.description || "",
  estimated_time: props.task?.estimated_time || 0,
  used_time: props.task?.used_time || 0,
  user_id: props.task?.user_id || null,
});

const users = ref<{ id: number; name: string }[]>([]);
const form = ref();
const isFormValid = ref(false);

onMounted(async () => {
  const response = await userService.getUsers();
  users.value = response.map(user => ({
    id: user.id,
    name: user.name
  }));

  if (!localTask.value.user_id && users.value.length > 0) {
    localTask.value.user_id = users.value[0].id;
  }
});

const isEditing = computed(() => !!props.task?.id);

const rules = {
  required: (value: any) => !!value || "This field is required",
  minLength: (value: string) => (value.length >= 5) || "Description must be at least 5 characters",
  minValue: (value: number) => (value >= 1) || "Estimated time must be at least 1",
  cannotBeNegative: (value: number) => (value >= 0) || "Used time cannot be negative"
};

const submit = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    console.warn("Form validation failed");
    snackbar?.show("Please fill out the form correctly.", "error");
    return;
  }

  localTask.value.estimated_time = parseFloat(localTask.value.estimated_time.toString()) || 0;
  localTask.value.used_time = parseFloat(localTask.value.used_time.toString()) || 0;

  try {
    if (isEditing.value) {
      await taskService.update(localTask.value.id, localTask.value);
      snackbar?.show("Task updated successfully!", "success");
    } else {
      await taskService.create(localTask.value);
      snackbar?.show("Task created successfully!", "success");
    }

    emit("saved");
    emit("close");
  } catch (error) {
    console.error("Task saving failed", error);
    snackbar?.show("Failed to save the task.", "error");
  }
};
</script>

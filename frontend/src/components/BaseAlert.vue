<template>
  <div v-if="message" :class="['alert', variant]">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: String,
  variant: {
    type: String,
    default: 'info'
  }
});
</script>

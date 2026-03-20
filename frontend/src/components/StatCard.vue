<template>
  <div class="card stat-card">
    <span class="stat-label">{{ label }}</span>
    <strong class="stat-value">{{ value }}</strong>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number]
});
</script>

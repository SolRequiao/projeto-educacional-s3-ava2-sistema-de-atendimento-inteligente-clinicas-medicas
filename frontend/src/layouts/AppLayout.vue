<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-main">
      <header class="page-header">
        <div>
          <h2>{{ title }}</h2>
          <p>{{ subtitle }}</p>
        </div>
      </header>
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from '../components/AppSidebar.vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

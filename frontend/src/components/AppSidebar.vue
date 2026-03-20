<template>
  <aside class="sidebar">
    <div>
      <div class="brand">
        <div class="brand-badge">CI</div>
        <div>
          <h1>Clínica Inteligente</h1>
          <p>Sistema de atendimento</p>
        </div>
      </div>

      <nav class="menu">
        <RouterLink to="/dashboard" class="menu-link">Dashboard</RouterLink>
        <RouterLink to="/agendar" class="menu-link">Agendar consulta</RouterLink>
        <RouterLink to="/perfil" class="menu-link">Meu perfil</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="menu-link">Painel administrativo</RouterLink>
      </nav>
    </div>

    <div class="sidebar-footer">
      <div class="user-mini-card">
        <strong>{{ auth.user?.name }}</strong>
        <span>{{ auth.isAdmin ? 'Administrador' : 'Paciente' }}</span>
      </div>
      <button class="btn btn-outline btn-block" @click="logout">Sair</button>
    </div>
  </aside>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

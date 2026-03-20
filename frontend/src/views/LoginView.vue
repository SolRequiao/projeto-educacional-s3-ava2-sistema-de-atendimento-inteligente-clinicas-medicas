<template>
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-brand">
        <div class="brand-badge large">CI</div>
        <h1>Entrar no sistema</h1>
        <p>Faça login para gerenciar consultas e atendimentos da clínica.</p>
      </div>

      <BaseAlert :message="message" :variant="messageType" />

      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input id="email" v-model="form.email" type="email" placeholder="email@exemplo.com" required />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input id="password" v-model="form.password" type="password" placeholder="Digite sua senha" required />
        </div>

        <button class="btn btn-primary btn-block" :disabled="auth.loading">
          {{ auth.loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="auth-footer">
        <span>Não possui conta?</span>
        <RouterLink to="/cadastro">Criar cadastro</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import BaseAlert from '../components/BaseAlert.vue';

const router = useRouter();
const auth = useAuthStore();
const message = ref('');
const messageType = ref('error');

const form = reactive({
  email: '',
  password: ''
});

async function handleLogin() {
  message.value = '';
  try {
    await auth.login(form);
    router.push(auth.isAdmin ? '/admin' : '/dashboard');
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Não foi possível realizar o login.';
  }
}
</script>

<template>
  <section class="auth-page auth-page-register">
    <div class="auth-card auth-card-wide">
      <div class="auth-brand">
        <div class="brand-badge large">CI</div>
        <h1>Criar conta</h1>
        <p>Cadastre paciente ou secretário e conecte o endereço pelo CEP.</p>
      </div>

      <BaseAlert :message="message" :variant="messageType" />

      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Nome completo</label>
            <input id="name" v-model="form.name" type="text" required />
          </div>

          <div class="form-group">
            <label for="email">E-mail</label>
            <input id="email" v-model="form.email" type="email" required />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input id="password" v-model="form.password" type="password" minlength="6" required />
          </div>

          <div class="form-group">
            <label for="role">Perfil</label>
            <select id="role" v-model="form.role">
              <option value="patient">Paciente</option>
              <option value="admin">Secretário/Administrador</option>
            </select>
          </div>

          <div class="form-group">
            <label for="phone">Telefone</label>
            <input id="phone" v-model="form.phone" type="text" />
          </div>

          <div class="form-group">
            <label for="cep">CEP</label>
            <div class="inline-group">
              <input id="cep" v-model="form.cep" type="text" placeholder="00000-000" />
              <button type="button" class="btn btn-outline" @click="searchCep" :disabled="loadingCep">{{ loadingCep ? 'Buscando...' : 'Buscar CEP' }}</button>
            </div>
          </div>

          <div class="form-group form-group-full">
            <label for="street">Logradouro</label>
            <input id="street" v-model="form.street" type="text" />
          </div>

          <div class="form-group">
            <label for="number">Número</label>
            <input id="number" v-model="form.number" type="text" />
          </div>

          <div class="form-group">
            <label for="district">Bairro</label>
            <input id="district" v-model="form.district" type="text" />
          </div>

          <div class="form-group">
            <label for="city">Cidade</label>
            <input id="city" v-model="form.city" type="text" />
          </div>

          <div class="form-group">
            <label for="state">UF</label>
            <input id="state" v-model="form.state" type="text" maxlength="2" />
          </div>
        </div>

        <button class="btn btn-primary btn-block" :disabled="auth.loading">
          {{ auth.loading ? 'Cadastrando...' : 'Criar conta' }}
        </button>
      </form>

      <div class="auth-footer">
        <span>Já possui conta?</span>
        <RouterLink to="/login">Entrar</RouterLink>
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
const loadingCep = ref(false);
const message = ref('');
const messageType = ref('error');

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'patient',
  phone: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  city: '',
  state: ''
});

async function searchCep() {
  if (!form.cep) {
    messageType.value = 'error';
    message.value = 'Informe um CEP antes de realizar a busca.';
    return;
  }

  loadingCep.value = true;
  message.value = '';

  try {
    const cleanCep = form.cep.replace(/\D/g, '');
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (!response.ok || data.erro) {
      throw new Error('CEP não encontrado.');
    }

    form.cep = data.cep || form.cep;
    form.street = data.logradouro || '';
    form.district = data.bairro || '';
    form.city = data.localidade || '';
    form.state = data.uf || '';
    messageType.value = 'success';
    message.value = 'Endereço preenchido com sucesso.';
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Não foi possível consultar o CEP.';
  } finally {
    loadingCep.value = false;
  }
}

async function handleRegister() {
  message.value = '';

  try {
    await auth.register(form);
    messageType.value = 'success';
    message.value = 'Cadastro realizado com sucesso.';
    router.push(auth.isAdmin ? '/admin' : '/dashboard');
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Não foi possível concluir o cadastro.';
  }
}
</script>

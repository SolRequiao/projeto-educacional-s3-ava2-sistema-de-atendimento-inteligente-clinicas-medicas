<template>
  <AppLayout title="Meu perfil" subtitle="Atualize seus dados e consulte o endereço automaticamente pelo CEP.">
    <BaseAlert :message="message" :variant="messageType" />

    <form class="card form-card" @submit.prevent="saveProfile">
      <div class="form-grid">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="form.name" type="text" required />
        </div>

        <div class="form-group">
          <label>E-mail</label>
          <input v-model="form.email" type="email" required />
        </div>

        <div class="form-group">
          <label>Telefone</label>
          <input v-model="form.phone" type="text" />
        </div>

        <div class="form-group">
          <label>CEP</label>
          <div class="inline-group">
            <input v-model="form.cep" type="text" />
            <button type="button" class="btn btn-outline" @click="searchCep" :disabled="searchingCep">
              {{ searchingCep ? 'Buscando...' : 'Buscar CEP' }}
            </button>
          </div>
        </div>

        <div class="form-group form-group-full">
          <label>Logradouro</label>
          <input v-model="form.street" type="text" />
        </div>

        <div class="form-group">
          <label>Número</label>
          <input v-model="form.number" type="text" />
        </div>

        <div class="form-group">
          <label>Bairro</label>
          <input v-model="form.district" type="text" />
        </div>

        <div class="form-group">
          <label>Cidade</label>
          <input v-model="form.city" type="text" />
        </div>

        <div class="form-group">
          <label>UF</label>
          <input v-model="form.state" type="text" maxlength="2" />
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-primary" :disabled="saving">{{ saving ? 'Salvando...' : 'Salvar perfil' }}</button>
      </div>
    </form>
  </AppLayout>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import api from '../services/api';
import AppLayout from '../layouts/AppLayout.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { useAuthStore } from '../stores/authStore';

const auth = useAuthStore();
const saving = ref(false);
const searchingCep = ref(false);
const message = ref('');
const messageType = ref('info');

const form = reactive({
  name: '',
  email: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  city: '',
  state: ''
});

function hydrateForm() {
  Object.assign(form, {
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
    cep: auth.user?.cep || '',
    street: auth.user?.street || '',
    number: auth.user?.number || '',
    district: auth.user?.district || '',
    city: auth.user?.city || '',
    state: auth.user?.state || ''
  });
}

async function searchCep() {
  if (!form.cep) return;
  searchingCep.value = true;
  message.value = '';

  try {
    const { data } = await api.get(`/users/cep/${form.cep}`);
    form.cep = data.cep || form.cep;
    form.street = data.street || '';
    form.district = data.district || '';
    form.city = data.city || '';
    form.state = data.state || '';
    messageType.value = 'success';
    message.value = 'Endereço atualizado a partir do CEP.';
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Erro ao consultar CEP.';
  } finally {
    searchingCep.value = false;
  }
}

async function saveProfile() {
  saving.value = true;
  message.value = '';

  try {
    const { data } = await api.put('/users/profile', { ...form });
    auth.user = data.user;
    localStorage.setItem('clinica_user', JSON.stringify(data.user));
    hydrateForm();
    messageType.value = 'success';
    message.value = data.message;
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Não foi possível atualizar o perfil.';
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  if (!auth.user) {
    await auth.fetchMe();
  }
  hydrateForm();
});
</script>

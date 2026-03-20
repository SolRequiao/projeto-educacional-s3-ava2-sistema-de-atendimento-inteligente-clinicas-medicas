<template>
  <AppLayout title="Dashboard" subtitle="Acompanhe suas consultas, status e alertas climáticos.">
    <BaseAlert :message="message" :variant="messageType" />

    <section class="stats-grid">
      <StatCard label="Total de consultas" :value="appointments.length" />
      <StatCard label="Consultas com chuva" :value="rainyAppointments" />
      <StatCard label="Confirmadas" :value="confirmedAppointments" />
      <StatCard label="Canceladas" :value="cancelledAppointments" />
    </section>

    <section class="content-grid single">
      <AppointmentTable title="Minhas consultas" :appointments="appointments" :show-actions="true">
        <template #row-actions="{ appointment }">
          <button class="btn btn-danger btn-sm" @click="removeAppointment(appointment._id)">Remover</button>
        </template>
      </AppointmentTable>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import StatCard from '../components/StatCard.vue';
import AppointmentTable from '../components/AppointmentTable.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { useAppointmentStore } from '../stores/appointmentStore';

const store = useAppointmentStore();
const message = ref('');
const messageType = ref('info');

const appointments = computed(() => store.myAppointments);
const rainyAppointments = computed(() => appointments.value.filter((item) => item.weatherAlert).length);
const confirmedAppointments = computed(() => appointments.value.filter((item) => item.status === 'confirmed').length);
const cancelledAppointments = computed(() => appointments.value.filter((item) => item.status === 'cancelled').length);

async function loadData() {
  message.value = '';
  try {
    await store.fetchMyAppointments();
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Não foi possível carregar as consultas.';
  }
}

async function removeAppointment(id) {
  if (!window.confirm('Deseja realmente remover esta consulta?')) return;

  try {
    const response = await store.deleteAppointment(id);
    messageType.value = 'success';
    message.value = response.message;
    await loadData();
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Falha ao remover consulta.';
  }
}

onMounted(loadData);
</script>

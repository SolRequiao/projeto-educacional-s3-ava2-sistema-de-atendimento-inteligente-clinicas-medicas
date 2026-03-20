<template>
  <AppLayout title="Agendar consulta" subtitle="Preencha os dados da consulta e envie para o backend validar disponibilidade.">
    <BaseAlert :message="message" :variant="messageType" />
    <AppointmentForm :loading="saving" submit-text="Agendar consulta" @submit="handleSubmit" />
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../layouts/AppLayout.vue';
import AppointmentForm from '../components/AppointmentForm.vue';
import BaseAlert from '../components/BaseAlert.vue';
import { useAppointmentStore } from '../stores/appointmentStore';

const store = useAppointmentStore();
const router = useRouter();
const saving = ref(false);
const message = ref('');
const messageType = ref('info');

async function handleSubmit(payload) {
  saving.value = true;
  message.value = '';

  try {
    const response = await store.createAppointment(payload);
    messageType.value = 'success';
    message.value = `${response.message} ${response.appointment.weatherAlert ? `Alerta: ${response.appointment.weatherDescription}.` : ''}`.trim();
    setTimeout(() => router.push('/dashboard'), 800);
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Não foi possível agendar a consulta.';
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <AppLayout title="Painel administrativo" subtitle="Gerencie consultas, acompanhe indicadores e altere os status dos atendimentos.">
    <BaseAlert :message="message" :variant="messageType" />

    <section class="stats-grid" v-if="dashboard">
      <StatCard label="Total de consultas" :value="dashboard.indicators.totalAppointments" />
      <StatCard label="Consultas hoje" :value="dashboard.indicators.todayAppointments" />
      <StatCard label="Alertas de chuva" :value="dashboard.indicators.rainyAppointments" />
      <StatCard label="Agendadas" :value="dashboard.indicators.scheduled" />
      <StatCard label="Confirmadas" :value="dashboard.indicators.confirmed" />
      <StatCard label="Canceladas" :value="dashboard.indicators.cancelled" />
      <StatCard label="Concluídas" :value="dashboard.indicators.completed" />
    </section>

    <section class="content-grid two-columns">
      <div class="card form-card compact">
        <h3>Filtrar consultas</h3>
        <div class="form-grid admin-filter-grid">
          <div class="form-group">
            <label>Status</label>
            <select v-model="filters.status">
              <option value="">Todos</option>
              <option value="scheduled">Agendada</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="completed">Concluída</option>
            </select>
          </div>
          <div class="form-group">
            <label>Data</label>
            <input v-model="filters.date" type="date" />
          </div>
          <div class="form-group">
            <label>Médico</label>
            <input v-model="filters.doctorName" type="text" />
          </div>
          <div class="form-group">
            <label>Especialidade</label>
            <input v-model="filters.specialty" type="text" />
          </div>
        </div>
        <div class="form-actions start">
          <button class="btn btn-primary" @click="loadData">Aplicar filtros</button>
          <button class="btn btn-outline" @click="clearFilters">Limpar</button>
        </div>
      </div>

      <div class="card form-card compact">
        <h3>Próximas consultas</h3>
        <div v-if="dashboard?.nextAppointments?.length" class="next-list">
          <div v-for="item in dashboard.nextAppointments" :key="item._id" class="next-item">
            <strong>{{ item.patient?.name }}</strong>
            <span>{{ item.doctorName }} • {{ item.specialty }}</span>
            <span>{{ item.date }} às {{ item.time }}</span>
          </div>
        </div>
        <div v-else class="empty-state">Nenhuma consulta próxima.</div>
      </div>
    </section>

    <AppointmentTable title="Gerenciamento de consultas" :appointments="appointments" :show-actions="true">
      <template #row-actions="{ appointment }">
        <select class="status-select" :value="appointment.status" @change="changeStatus(appointment, $event.target.value)">
          <option value="scheduled">Agendada</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
          <option value="completed">Concluída</option>
        </select>
      </template>
    </AppointmentTable>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppLayout from '../layouts/AppLayout.vue';
import BaseAlert from '../components/BaseAlert.vue';
import StatCard from '../components/StatCard.vue';
import AppointmentTable from '../components/AppointmentTable.vue';
import { useAppointmentStore } from '../stores/appointmentStore';

const store = useAppointmentStore();
const message = ref('');
const messageType = ref('info');

const filters = reactive({
  status: '',
  date: '',
  doctorName: '',
  specialty: ''
});

const appointments = computed(() => store.allAppointments);
const dashboard = computed(() => store.dashboard);

async function loadData() {
  message.value = '';
  try {
    await Promise.all([
      store.fetchDashboard(),
      store.fetchAllAppointments({ ...filters })
    ]);
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Falha ao carregar dados administrativos.';
  }
}

function clearFilters() {
  filters.status = '';
  filters.date = '';
  filters.doctorName = '';
  filters.specialty = '';
  loadData();
}

async function changeStatus(appointment, status) {
  try {
    const response = await store.updateStatus(appointment._id, status);
    messageType.value = 'success';
    message.value = response.message;
    await loadData();
  } catch (error) {
    messageType.value = 'error';
    message.value = error.response?.data?.message || 'Falha ao alterar o status.';
  }
}

onMounted(loadData);
</script>

<template>
  <div class="card table-card">
    <div class="table-header">
      <h3>{{ title }}</h3>
      <slot name="actions" />
    </div>

    <div v-if="appointments.length === 0" class="empty-state">
      Nenhuma consulta encontrada.
    </div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Médico</th>
            <th>Especialidade</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Clima</th>
            <th v-if="showActions">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment._id">
            <td>{{ appointment.patient?.name || '-' }}</td>
            <td>{{ appointment.doctorName }}</td>
            <td>{{ appointment.specialty }}</td>
            <td>{{ formatDate(appointment.date) }}</td>
            <td>{{ appointment.time }}</td>
            <td>
              <span :class="['status-badge', statusClass(appointment.status)]">
                {{ formatStatus(appointment.status) }}
              </span>
            </td>
            <td>
              <span v-if="appointment.weatherAlert" class="weather-badge rainy">
                Chuva: {{ appointment.weatherDescription }}
              </span>
              <span v-else class="weather-badge clear">
                {{ appointment.weatherDescription || 'Sem alerta' }}
              </span>
            </td>
            <td v-if="showActions">
              <div class="table-actions">
                <slot name="row-actions" :appointment="appointment" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { formatDate, formatStatus, statusClass } from '../utils/formatters';

defineProps({
  title: {
    type: String,
    default: 'Consultas'
  },
  appointments: {
    type: Array,
    default: () => []
  },
  showActions: {
    type: Boolean,
    default: false
  }
});
</script>

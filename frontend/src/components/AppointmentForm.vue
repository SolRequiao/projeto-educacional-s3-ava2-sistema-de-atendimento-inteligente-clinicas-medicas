<template>
  <form class="card form-card" @submit.prevent="submitForm">
    <div class="form-grid">
      <div class="form-group">
        <label for="doctorName">Nome do médico</label>
        <input id="doctorName" v-model="form.doctorName" type="text" placeholder="Ex.: Dra. Maria Souza" required />
      </div>

      <div class="form-group">
        <label for="specialty">Especialidade</label>
        <input id="specialty" v-model="form.specialty" type="text" placeholder="Ex.: Clínico Geral" required />
      </div>

      <div class="form-group">
        <label for="date">Data</label>
        <input id="date" v-model="form.date" type="date" required />
      </div>

      <div class="form-group">
        <label for="time">Horário</label>
        <input id="time" v-model="form.time" type="time" required />
      </div>

      <div class="form-group form-group-full">
        <label for="notes">Observações</label>
        <textarea id="notes" v-model="form.notes" rows="4" maxlength="500" placeholder="Descreva detalhes da consulta"></textarea>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Salvando...' : submitText }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      notes: ''
    })
  },
  loading: Boolean,
  submitText: {
    type: String,
    default: 'Salvar consulta'
  }
});

const emit = defineEmits(['submit']);

const form = reactive({ ...props.modelValue });

watch(
  () => props.modelValue,
  (value) => Object.assign(form, value),
  { deep: true }
);

function submitForm() {
  emit('submit', { ...form });
}
</script>

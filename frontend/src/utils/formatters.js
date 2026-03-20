export function formatDate(date) {
  if (!date) return '-';
  const [year, month, day] = date.split('-');
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
}

export function formatRole(role) {
  return role === 'admin' ? 'Secretário/Administrador' : 'Paciente';
}

export function formatStatus(status) {
  const map = {
    scheduled: 'Agendada',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Concluída'
  };

  return map[status] || status;
}

export function statusClass(status) {
  const map = {
    scheduled: 'scheduled',
    confirmed: 'confirmed',
    cancelled: 'cancelled',
    completed: 'completed'
  };

  return map[status] || 'scheduled';
}

export function formatDate(value) {
  if (!value) return '-';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function getResultLabel(result) {
  return {
    win: 'Vitória',
    draw: 'Empate',
    loss: 'Derrota',
  }[result] || result;
}

export function getResultColor(result) {
  return {
    win: 'success',
    draw: 'warning',
    loss: 'error',
  }[result] || 'default';
}


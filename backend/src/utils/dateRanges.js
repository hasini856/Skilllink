export const getLastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

export const toDateKey = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

export const formatShortDate = (dateKey) => {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

function StatCard({ label, value, subtext, accent = 'primary' }) {
  const accents = {
    primary: 'border-primary-200 bg-primary-50 text-primary-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    violet: 'border-violet-200 bg-violet-50 text-violet-700',
  };

  return (
    <div className={`rounded-xl border p-5 ${accents[accent] || accents.primary}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      {subtext && <p className="mt-1 text-xs opacity-70">{subtext}</p>}
    </div>
  );
}

export default StatCard;

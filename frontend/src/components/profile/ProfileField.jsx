function ProfileField({ label, id, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default ProfileField;

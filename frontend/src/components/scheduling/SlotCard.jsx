import { formatSessionTimeRange } from '../../utils/datetime.js';

function SlotCard({ slot, children }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">{slot.topic}</h3>
      {slot.mentor && (
        <p className="mt-1 text-sm text-slate-600">Mentor: {slot.mentor.name}</p>
      )}
      <p className="mt-1 text-sm text-slate-500">
        {formatSessionTimeRange(slot.startTime, slot.endTime)}
      </p>
      {slot.mentor?.profile?.expertise?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {slot.mentor.profile.expertise.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-violet-50 px-2 py-0.5 text-xs text-violet-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </article>
  );
}

export default SlotCard;

import { useEffect, useState } from 'react';
import ProfileField from './ProfileField.jsx';
import { listToText } from '../../utils/profile.js';

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

function MentorProfileForm({ profile, onSave, saving }) {
  const [form, setForm] = useState({
    expertise: '',
    experience: '',
    availability: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        expertise: listToText(profile.expertise),
        experience: profile.experience || '',
        availability: profile.availability || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <ProfileField
        label="Expertise"
        id="expertise"
        hint="Areas you can mentor in (comma-separated)"
      >
        <input
          id="expertise"
          name="expertise"
          type="text"
          value={form.expertise}
          onChange={handleChange}
          className={inputClass}
          placeholder="React, Career coaching, UX design"
        />
      </ProfileField>

      <ProfileField label="Experience" id="experience" hint="Your background and mentoring experience">
        <textarea
          id="experience"
          name="experience"
          rows={4}
          value={form.experience}
          onChange={handleChange}
          className={inputClass}
          placeholder="10 years in software engineering, led teams at..."
        />
      </ProfileField>

      <ProfileField label="Availability" id="availability" hint="When and how you are available to mentor">
        <textarea
          id="availability"
          name="availability"
          rows={3}
          value={form.availability}
          onChange={handleChange}
          className={inputClass}
          placeholder="Weekday evenings, 1-hour sessions, video calls"
        />
      </ProfileField>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  );
}

export default MentorProfileForm;

import { useEffect, useState } from 'react';
import ProfileField from './ProfileField.jsx';
import { listToText } from '../../utils/profile.js';

const inputClass =
  'w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

function LearnerProfileForm({ profile, onSave, saving }) {
  const [form, setForm] = useState({
    skills: '',
    interests: '',
    goals: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        skills: listToText(profile.skills),
        interests: listToText(profile.interests),
        goals: profile.goals || '',
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
        label="Skills"
        id="skills"
        hint="Skills you already have or are building (comma-separated)"
      >
        <input
          id="skills"
          name="skills"
          type="text"
          value={form.skills}
          onChange={handleChange}
          className={inputClass}
          placeholder="JavaScript, Public speaking, Design"
        />
      </ProfileField>

      <ProfileField
        label="Interests"
        id="interests"
        hint="Topics you want to explore (comma-separated)"
      >
        <input
          id="interests"
          name="interests"
          type="text"
          value={form.interests}
          onChange={handleChange}
          className={inputClass}
          placeholder="Web development, Leadership, Data science"
        />
      </ProfileField>

      <ProfileField label="Goals" id="goals" hint="What you hope to achieve on SkillLink">
        <textarea
          id="goals"
          name="goals"
          rows={4}
          value={form.goals}
          onChange={handleChange}
          className={inputClass}
          placeholder="I want to find a mentor for..."
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

export default LearnerProfileForm;

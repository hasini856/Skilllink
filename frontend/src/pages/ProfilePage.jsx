import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { getDashboardPath } from '../utils/auth.js';
import LearnerProfileForm from '../components/profile/LearnerProfileForm.jsx';
import MentorProfileForm from '../components/profile/MentorProfileForm.jsx';

function ProfilePage() {
  const { user } = useAuth(); // ✅ FIXED (removed setUser)

  const [profile, setProfile] = useState(user?.profile ?? null);
  const [loading, setLoading] = useState(!user?.profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile();

        // backend should return user object
        const profileUser = data.user || data;

       setProfile(profileUser);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async (formData) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const data = await api.updateProfile(formData);

      const updatedUser = data.user || data;

      setProfile(updatedUser.profile);

      setSuccess('Profile saved successfully.');
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700 shadow-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary-600">
              {user?.role === 'mentor' ? 'Mentor Profile' : 'Learner Profile'}
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {user?.name}
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              {user?.email}
            </p>
          </div>
        </div>

        <Link
          to={getDashboardPath(user?.role)}
          className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition hover:bg-primary-100"
        >
          Back to dashboard
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Profile Overview</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Role
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {user?.role === 'mentor' ? 'Mentor' : 'Learner'}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Account Status
              </p>
              <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Active
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                SkillLink Member
              </p>
              <p className="mt-1 font-medium text-slate-800">
                Community Member
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Edit Profile
          </h2>

          {user?.role === 'learner' ? (
            <LearnerProfileForm
              profile={profile}
              onSave={handleSave}
              saving={saving}
            />
          ) : (
            <MentorProfileForm
              profile={profile}
              onSave={handleSave}
              saving={saving}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
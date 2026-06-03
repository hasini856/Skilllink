import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardPath } from '../utils/auth.js';

const ROLES = [
  {
    value: 'learner',
    label: 'Learner',
    description: 'Find mentors and learn new skills',
  },
  {
    value: 'mentor',
    label: 'Mentor',
    description: 'Share your expertise and guide others',
  },
];

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'learner',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const data = await register(payload);

      navigate(getDashboardPath(data.user.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>

      <p className="mt-2 text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Log in
        </Link>
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
          minLength={6}
        />

        <div className="space-y-2">
          {ROLES.map((r) => (
            <label key={r.value} className="flex gap-2">
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={form.role === r.value}
                onChange={handleChange}
              />
              <div>
                <div className="font-semibold">{r.label}</div>
                <div className="text-sm text-gray-500">{r.description}</div>
              </div>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {submitting ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
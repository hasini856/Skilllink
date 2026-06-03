import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ChartCard from '../components/analytics/ChartCard.jsx';
import StatCard from '../components/analytics/StatCard.jsx';
import { api } from '../services/api.js';

const EMPTY = {
  summary: {},
  activeUsers: { daily: [] },
  engagement: { daily: [], breakdown: [] },
  trendingSkills: [],
  sessionAttendance: { byStatus: [], weekly: [] },
  collaborationTrends: { daily: [], byType: [] },
};

function AnalyticsDashboardPage() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const analytics = await api.getAnalytics();
        setData(analytics);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }

  const { summary } = data;

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-primary-600">Insights</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Analytics dashboard</h1>
        <p className="mt-2 text-slate-600">
          Platform activity, engagement, skills trends, and collaboration over the last 7 days.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={summary.totalUsers ?? 0} subtext={`${summary.learners ?? 0} learners · ${summary.mentors ?? 0} mentors`} />
        <StatCard label="Active users (7d)" value={summary.activeUsers7d ?? 0} subtext="Registered or engaged" accent="emerald" />
        <StatCard label="Engagement events" value={summary.engagementScore ?? 0} subtext="Last 7 days" accent="violet" />
        <StatCard label="Total sessions" value={summary.totalSessions ?? 0} subtext={`${summary.totalConnections ?? 0} connections`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Active users" description="New user registrations per day">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.activeUsers.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5' }} name="New users" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="App engagement" description="Connections, session bookings, and slots created">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.engagement.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="connections" stackId="1" stroke="#4f46e5" fill="#818cf8" name="Connections" />
              <Area type="monotone" dataKey="sessions" stackId="1" stroke="#6366f1" fill="#a5b4fc" name="Sessions" />
              <Area type="monotone" dataKey="slots" stackId="1" stroke="#c7d2fe" fill="#e0e7ff" name="Slots" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trending skills" description="Most common skills across profiles and sessions" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.trendingSkills} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="skill" width={100} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} name="Mentions" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Session attendance" description="Session status breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.sessionAttendance.byStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.sessionAttendance.byStatus.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sessions booked vs completed" description="Daily session activity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.sessionAttendance.weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="booked" fill="#c7d2fe" name="Booked" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attended" fill="#4f46e5" name="Completed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Collaboration trends" description="Peer and mentor connections over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.collaborationTrends.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="peer" stroke="#10b981" strokeWidth={2} name="Peer" />
              <Line type="monotone" dataKey="mentor" stroke="#8b5cf6" strokeWidth={2} name="Mentor" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Collaboration mix" description="Total connections by type">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.collaborationTrends.byType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.collaborationTrends.byType.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {data.trendingSkills.length === 0 && data.summary.totalUsers === 0 && (
        <p className="mt-6 text-center text-sm text-slate-500">
          No data yet. As users join, connect, and book sessions, charts will populate here.
        </p>
      )}
    </section>
  );
}

export default AnalyticsDashboardPage;

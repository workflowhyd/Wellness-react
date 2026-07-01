import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  BookOpen,
  MessagesSquare,
  Settings,
  LogOut,
  Search,
  Bell,
  Users,
  TrendingUp,
  GraduationCap,
  MessageCircleMore,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid, active: true },
  { label: 'Manage Courses', icon: BookOpen },
  { label: 'Student Inquiries', icon: MessagesSquare },
  { label: 'Settings', icon: Settings },
];

const METRICS = [
  { label: 'Total Students', value: '1,750+', trend: '+8.2%', icon: Users },
  { label: 'Active Courses', value: '12', trend: '+2', icon: GraduationCap },
  { label: 'New Inquiries', value: '24', trend: '+15%', icon: MessageCircleMore, sub: 'this week' },
];

const INQUIRIES = [
  { name: 'Priya Sharma', contact: '+91 98456 12345', course: 'Diploma in Ayurveda', date: '28 Jun 2026', status: 'Pending' },
  { name: 'Rahul Verma', contact: '+91 99001 22334', course: 'Diploma in Spa Therapy', date: '27 Jun 2026', status: 'Enrolled' },
  { name: 'Anjali Nair', contact: '+91 90876 55123', course: 'Advanced Aesthetics Course', date: '26 Jun 2026', status: 'Pending' },
  { name: 'Karthik Iyer', contact: '+91 97123 44556', course: 'Airbrush Makeup Course', date: '25 Jun 2026', status: 'Enrolled' },
];

const COURSES = [
  'Diploma in Ayurveda',
  'Diploma in Spa Therapy',
  'Advanced Aesthetics Course',
  'Airbrush Makeup Course',
];

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Enrolled: 'bg-emerald-100 text-emerald-700',
};

export default function AdminDashboard() {
  const [active, setActive] = useState('Dashboard');

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-teal text-white md:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-bold text-brand-green-light">
            GW
          </div>
          <span className="text-lg font-semibold">GW Admin</span>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                active === label
                  ? 'bg-white/15 text-white'
                  : 'text-brand-green-light/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="m-3 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-brand-green-light/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ---------------- Main content ---------------- */}
      <div className="flex-1">
        {/* Top header */}
        <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h1 className="text-lg font-bold text-slate-800 sm:text-xl">Welcome back, Admin</h1>
            <p className="text-xs text-slate-500">Here's what's happening at your institute today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-56 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-green"
              />
            </div>
            <button type="button" className="relative text-slate-500 hover:text-brand-teal">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-brand-green-light">
              A
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8">
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            {METRICS.map(({ label, value, trend, icon: Icon, sub }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                    <Icon size={20} />
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <TrendingUp size={14} />
                    {trend}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">
                  {label}
                  {sub ? ` · ${sub}` : ''}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Inquiries table + quick actions */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="text-sm font-bold text-slate-800">Recent Inquiries</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                      <th className="py-2 pr-4 font-semibold">Name</th>
                      <th className="py-2 pr-4 font-semibold">Contact</th>
                      <th className="py-2 pr-4 font-semibold">Course</th>
                      <th className="py-2 pr-4 font-semibold">Date</th>
                      <th className="py-2 pr-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INQUIRIES.map((row) => (
                      <tr key={row.name} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 font-medium text-slate-700">{row.name}</td>
                        <td className="py-3 pr-4 text-slate-500">{row.contact}</td>
                        <td className="py-3 pr-4 text-slate-500">{row.course}</td>
                        <td className="py-3 pr-4 text-slate-500">{row.date}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[row.status]}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
              </div>
              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <Plus size={16} />
                Add New Course
              </button>

              <ul className="mt-5 flex flex-col gap-2">
                {COURSES.map((course) => (
                  <li
                    key={course}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                  >
                    <span className="truncate pr-2">{course}</span>
                    <div className="flex shrink-0 gap-2 text-slate-400">
                      <button type="button" className="hover:text-brand-green" aria-label="Edit course">
                        <Pencil size={15} />
                      </button>
                      <button type="button" className="hover:text-red-500" aria-label="Delete course">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

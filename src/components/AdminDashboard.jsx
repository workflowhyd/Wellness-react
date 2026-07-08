import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  BookOpen,
  MessagesSquare,
  GraduationCap as StudentsIcon,
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
  Loader2,
  Lock,
} from 'lucide-react';
import {
  fetchInquiries,
  fetchCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  checkSession,
  login,
  logout,
} from '../lib/api';
import CoursesTab from './admin/CoursesTab';
import InquiriesTab from './admin/InquiriesTab';
import StudentsTab from './admin/StudentsTab';
import SettingsTab from './admin/SettingsTab';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Manage Courses', icon: BookOpen },
  { label: 'Student Inquiries', icon: MessagesSquare },
  { label: 'Manage Students', icon: StudentsIcon },
  { label: 'Settings', icon: Settings },
];

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

export default function AdminDashboard() {
  const [authState, setAuthState] = useState('checking'); // checking | login | in
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [active, setActive] = useState('Dashboard');

  const [inquiries, setInquiries] = useState([]);
  const [inquiriesState, setInquiriesState] = useState('loading'); // loading | error | ready

  const [courses, setCourses] = useState([]);
  const [coursesState, setCoursesState] = useState('loading');

  useEffect(() => {
    checkSession()
      .then((res) => setAuthState(res.authenticated ? 'in' : 'login'))
      .catch(() => setAuthState('login'));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      await login(password);
      setPassword('');
      setAuthState('in');
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    setInquiries([]);
    setCourses([]);
    setInquiriesState('loading');
    setCoursesState('loading');
    setAuthState('login');
  };

  const loadInquiries = () => {
    setInquiriesState('loading');
    fetchInquiries()
      .then((rows) => {
        setInquiries(rows);
        setInquiriesState('ready');
      })
      .catch(() => setInquiriesState('error'));
  };

  const loadCourses = () => {
    setCoursesState('loading');
    fetchCourses()
      .then((rows) => {
        setCourses(rows);
        setCoursesState('ready');
      })
      .catch(() => setCoursesState('error'));
  };

  useEffect(() => {
    if (authState !== 'in') return;
    loadInquiries();
    loadCourses();
  }, [authState]);

  const handleAddCourse = async () => {
    const title = window.prompt('New course name:');
    if (!title || !title.trim()) return;
    await addCourse(title.trim()).catch(() => window.alert('Could not add course.'));
    loadCourses();
  };

  const handleEditCourse = async (course) => {
    const title = window.prompt('Rename course:', course.title);
    if (!title || !title.trim() || title.trim() === course.title) return;
    await updateCourse(course.id, title.trim()).catch(() => window.alert('Could not rename course.'));
    loadCourses();
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Delete "${course.title}"?`)) return;
    await deleteCourse(course.id).catch(() => window.alert('Could not delete course.'));
    loadCourses();
  };

  const metrics = [
    { label: 'Total Students', value: '1,750+', trend: '+8.2%', icon: Users },
    {
      label: 'Active Courses',
      value: coursesState === 'ready' ? String(courses.length) : '—',
      trend: '',
      icon: GraduationCap,
    },
    {
      label: 'Total Inquiries',
      value: inquiriesState === 'ready' ? String(inquiries.length) : '—',
      trend: '',
      icon: MessageCircleMore,
    },
  ];

  if (authState === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-400">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (authState === 'login') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-teal px-4">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-teal text-brand-green-light">
            <Lock size={22} />
          </div>
          <h1 className="mt-4 text-center text-lg font-bold text-slate-800">Admin Sign In</h1>
          <p className="mt-1 text-center text-xs text-slate-500">
            Enter the admin password to view student data.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-green"
          />
          {loginError && <p className="mt-2 text-xs text-red-500">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="mt-4 w-full rounded-lg bg-brand-orange py-3 text-sm font-semibold text-black shadow-md transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loggingIn ? 'Signing in…' : 'Sign In'}
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-teal text-white md:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-bold text-brand-green-light">
            S
          </div>
          <span className="font-['Cormorant_Garamond',serif] text-lg font-semibold">Skill Training Academy</span>
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
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-brand-green-light/80 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* ---------------- Main content ---------------- */}
      <div className="min-w-0 flex-1">
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
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-black">
                3
              </span>
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-brand-green-light">
              A
            </div>
          </div>
        </header>

        {/* Mobile tab bar — sidebar nav is hidden below md, this is the only
            way to switch tabs on phones */}
        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => setActive(label)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                active === label
                  ? 'bg-brand-teal text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>

        <main className="px-4 py-6 sm:px-8">
          {active === 'Dashboard' && (
            <>
          {/* Metrics */}
          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map(({ label, value, trend, icon: Icon }) => (
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
                  {trend && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <TrendingUp size={14} />
                      {trend}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Inquiries table + quick actions */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">
              <h2 className="text-sm font-bold text-slate-800">Recent Inquiries</h2>
              <div className="mt-4 overflow-x-auto">
                {inquiriesState === 'loading' && (
                  <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
                    <Loader2 size={16} className="animate-spin" /> Loading inquiries…
                  </div>
                )}
                {inquiriesState === 'error' && (
                  <div className="py-10 text-center text-sm text-red-500">
                    Couldn't load inquiries. Is the API deployed and configured?
                  </div>
                )}
                {inquiriesState === 'ready' && inquiries.length === 0 && (
                  <div className="py-10 text-center text-sm text-slate-400">
                    No inquiries yet — submissions from the enrollment form will show up here.
                  </div>
                )}
                {inquiriesState === 'ready' && inquiries.length > 0 && (
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
                      {inquiries.map((row) => (
                        <tr key={row.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-3 pr-4 font-medium text-slate-700">
                            {row.firstName} {row.lastName}
                          </td>
                          <td className="py-3 pr-4 text-slate-500">{row.phone}</td>
                          <td className="py-3 pr-4 text-slate-500">{row.course || '—'}</td>
                          <td className="py-3 pr-4 text-slate-500">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                STATUS_STYLES[row.status] || STATUS_STYLES.Pending
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
              </div>
              <button
                type="button"
                onClick={handleAddCourse}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange py-2.5 text-sm font-semibold text-black shadow-md transition-transform hover:scale-[1.02]"
              >
                <Plus size={16} />
                Add New Course
              </button>

              {coursesState === 'loading' && (
                <div className="mt-5 flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
                  <Loader2 size={16} className="animate-spin" /> Loading courses…
                </div>
              )}
              {coursesState === 'error' && (
                <div className="mt-5 py-6 text-center text-sm text-red-500">
                  Couldn't load courses.
                </div>
              )}
              {coursesState === 'ready' && (
                <ul className="mt-5 flex flex-col gap-2">
                  {courses.map((course) => (
                    <li
                      key={course.id}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <span className="truncate pr-2">{course.title}</span>
                      <div className="flex shrink-0 gap-2 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleEditCourse(course)}
                          className="hover:text-brand-green"
                          aria-label="Edit course"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course)}
                          className="hover:text-red-500"
                          aria-label="Delete course"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
            </>
          )}

          {active === 'Manage Courses' && <CoursesTab />}
          {active === 'Student Inquiries' && <InquiriesTab />}
          {active === 'Manage Students' && <StudentsTab />}
          {active === 'Settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

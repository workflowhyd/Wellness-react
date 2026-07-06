import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Loader2,
  ShieldCheck,
  Home as HomeIcon,
  ChevronRight,
  Search,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { searchCertificate } from '../lib/api';

const TABLE_COLUMNS = [
  { label: 'Registration No', sortable: true },
  { label: 'Name' },
  { label: 'Date Of Birth' },
  { label: 'Father/Husband Name' },
  { label: 'Course Duration In Days' },
  { label: 'Batch' },
  { label: 'Trained In' },
];

export default function CertificateSearch() {
  const [regNo, setRegNo] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | found | empty | error
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = regNo.trim();
    if (!trimmed) return;

    setStatus('loading');
    try {
      const row = await searchCertificate(trimmed);
      if (row) {
        setResult(row);
        setStatus('found');
      } else {
        setResult(null);
        setStatus('empty');
      }
    } catch {
      setResult(null);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#111013] font-[Jost,ui-sans-serif,system-ui,sans-serif] text-slate-100">
      {/* ---------------- Top header ---------------- */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#1b191e]/90 shadow-[0_1px_10px_rgba(0,0,0,0.3)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal text-sm font-bold text-brand-gold">
              S
            </div>
            <span className="hidden font-[\'Cormorant_Garamond\',serif] text-base font-semibold leading-tight text-white sm:block">
              Skill Training Academy
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-brand-gold"
          >
            <HomeIcon size={15} />
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* ---------------- Breadcrumbs ---------------- */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/50">
          <Link to="/" className="flex items-center gap-1 transition-colors hover:text-brand-gold">
            <HomeIcon size={14} />
            Home
          </Link>
          <ChevronRight size={14} className="text-white/30" />
          <span className="font-medium text-white/80">Certificate Verification</span>
        </nav>

        {/* ---------------- Hero ---------------- */}
        <div className="mt-10 flex animate-fade-in flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-maroon/10">
            <ShieldCheck size={28} className="text-brand-maroon" />
          </div>
          <h1 className="mt-5 font-[\'Cormorant_Garamond\',serif] text-4xl font-semibold tracking-tight text-white sm:text-[40px]">
            Certificate Verification
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-base text-white/60">
            Verify your certificate instantly by entering your Registration Number below.
          </p>
        </div>

        {/* ---------------- Search card ---------------- */}
        <div className="mx-auto mt-10 max-w-2xl animate-fade-in rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col items-stretch gap-4 sm:flex-row">
            <div className="relative flex-1">
              <label htmlFor="regNo" className="sr-only">
                Registration Number
              </label>
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="regNo"
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="Enter Registration No"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-maroon focus:bg-white focus:ring-4 focus:ring-brand-maroon/10"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !regNo.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-gold px-6 py-3.5 text-sm font-semibold text-black shadow-sm transition-all duration-250 hover:scale-[1.02] hover:bg-brand-green-light hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-maroon/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
            >
              {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
              {status === 'loading' ? 'Verifying…' : 'Verify Certificate'}
            </button>
          </form>

          {status === 'error' && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0" />
              Couldn't reach the server. Please try again in a moment.
            </p>
          )}
        </div>

        {/* ---------------- Results card ---------------- */}
        <div className="mx-auto mt-8 max-w-5xl animate-fade-in overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <h2 className="text-[22px] font-semibold text-slate-900">Certificate Details</h2>
          </div>

          {status === 'found' && result ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    {TABLE_COLUMNS.map((col) => (
                      <th
                        key={col.label}
                        className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600"
                      >
                        <span className="flex items-center gap-1.5">
                          {col.label}
                          {col.sortable && <ArrowUpDown size={13} className="text-slate-400" />}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100 transition-colors duration-150 hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">{result.registrationNo}</td>
                    <td className="px-5 py-4 text-slate-600">{result.name}</td>
                    <td className="px-5 py-4 text-slate-600">{result.dob}</td>
                    <td className="px-5 py-4 text-slate-600">{result.guardianName}</td>
                    <td className="px-5 py-4 text-slate-600">{result.courseDurationDays}</td>
                    <td className="px-5 py-4 text-slate-600">{result.batch}</td>
                    <td className="px-5 py-4 text-slate-600">{result.trainedIn}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              {status === 'loading' ? (
                <>
                  <Loader2 size={28} className="animate-spin text-brand-maroon/70" />
                  <p className="text-sm font-medium text-slate-500">Searching…</p>
                </>
              ) : status === 'empty' ? (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                    <AlertCircle size={22} className="text-amber-500" />
                  </div>
                  <p className="text-base font-semibold text-slate-700">No Certificate Found</p>
                  <p className="max-w-xs text-sm text-slate-400">
                    We couldn't find a certificate for this registration number.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <FileText size={22} className="text-slate-400" />
                  </div>
                  <p className="text-base font-semibold text-slate-700">No Certificate Selected</p>
                  <p className="max-w-xs text-sm text-slate-400">
                    Enter a Registration Number above to view certificate details.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

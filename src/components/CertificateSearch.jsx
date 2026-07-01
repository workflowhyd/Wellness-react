import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';

const HEADER_LINKS = ['Home', 'About Us', 'Courses', 'Contact Us'];

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

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* ---------------- Top header ---------------- */}
      <header className="bg-brand-maroon">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-3 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold text-sm font-bold text-brand-maroon">
            GW
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {HEADER_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-semibold text-brand-gold transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* ---------------- Breadcrumbs ---------------- */}
        <div className="text-sm font-sans font-semibold leading-6 text-indigo-950">
          <div>Home &lt;</div>
          <div>Search</div>
        </div>

        {/* ---------------- Search bar ---------------- */}
        <div className="mt-10 flex justify-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-md overflow-hidden rounded-full border-2 border-brand-gold shadow-sm"
          >
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Enter Register No"
              className="w-full px-5 py-3 text-sm text-slate-700 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 bg-white px-6 py-3 text-sm font-bold text-brand-green transition-colors hover:bg-slate-50"
            >
              Submit
            </button>
          </form>
        </div>

        {/* ---------------- Data table ---------------- */}
        <div className="mt-10 overflow-x-auto rounded-md border border-slate-300">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100">
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.label}
                    className="border border-slate-300 px-4 py-3 font-bold text-slate-800"
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <ArrowUpDown size={14} className="text-slate-500" />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={TABLE_COLUMNS.length}
                  className="border border-slate-300 bg-slate-100 py-6 text-center text-slate-500"
                >
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

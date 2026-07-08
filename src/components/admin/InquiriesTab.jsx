import { useEffect, useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { fetchInquiries, updateInquiryStatus } from '../../lib/api';

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

export default function InquiriesTab() {
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesState, setInquiriesState] = useState('loading'); // loading | error | ready
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchInquiries()
      .then((rows) => {
        setInquiries(rows);
        setInquiriesState('ready');
      })
      .catch(() => setInquiriesState('error'));
  }, []);

  const handleReview = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateInquiryStatus(id, status);
      setInquiries((rows) => rows.map((row) => (row.id === id ? { ...row, status } : row)));
    } catch {
      window.alert('Could not update this inquiry. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800">Student Inquiries</h2>
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
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Contact</th>
                <th className="py-2 pr-4 font-semibold">Email</th>
                <th className="py-2 pr-4 font-semibold">Course</th>
                <th className="py-2 pr-4 font-semibold">Date</th>
                <th className="py-2 pr-4 font-semibold">Status</th>
                <th className="py-2 pr-4 font-semibold">Review</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-700">
                    {row.firstName} {row.lastName}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">{row.phone}</td>
                  <td className="py-3 pr-4 text-slate-500">{row.email || '—'}</td>
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
                  <td className="py-3 pr-4">
                    {row.status === 'Pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReview(row.id, 'Approved')}
                          disabled={updatingId === row.id}
                          aria-label="Approve inquiry"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition-transform hover:scale-110 disabled:opacity-50"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReview(row.id, 'Rejected')}
                          disabled={updatingId === row.id}
                          aria-label="Reject inquiry"
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700 transition-transform hover:scale-110 disabled:opacity-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

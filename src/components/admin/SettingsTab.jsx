import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { changePassword } from '../../lib/api';

const EMPTY_FORM = { oldPassword: '', newPassword: '', confirmPassword: '' };

export default function SettingsTab() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await changePassword(form.oldPassword, form.newPassword);
      setForm(EMPTY_FORM);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800">Settings</h2>

      <form onSubmit={handleSubmit} className="mt-4 max-w-sm">
        <h3 className="text-sm font-semibold text-slate-700">Change Admin Password</h3>

        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">Current Password</label>
          <input
            type="password"
            value={form.oldPassword}
            onChange={setField('oldPassword')}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">New Password</label>
          <input
            type="password"
            value={form.newPassword}
            onChange={setField('newPassword')}
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
        <div className="mt-3">
          <label className="text-xs font-medium text-slate-600">Confirm New Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={setField('confirmPassword')}
            required
            minLength={6}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
        {success && <p className="mt-3 text-xs text-emerald-600">Password changed successfully.</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-black shadow-md transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Change Password
        </button>
      </form>
    </div>
  );
}

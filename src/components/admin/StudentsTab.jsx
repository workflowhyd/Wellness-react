import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, Search, X } from 'lucide-react';
import { fetchStudents, addStudent, updateStudent, deleteStudent } from '../../lib/api';

const EMPTY_FORM = {
  registrationNo: '',
  name: '',
  dob: '',
  guardianName: '',
  courseDurationDays: '',
  batch: '',
  trainedIn: '',
};

function StudentFormModal({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial ? { ...initial, courseDurationDays: String(initial.courseDurationDays) } : EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = {
      registrationNo: form.registrationNo.trim(),
      name: form.name.trim(),
      dob: form.dob.trim(),
      guardianName: form.guardianName.trim(),
      batch: form.batch.trim(),
      trainedIn: form.trainedIn.trim(),
    };
    const courseDurationDays = Number(form.courseDurationDays);

    if (Object.values(trimmed).some((v) => !v)) {
      setError('All fields are required.');
      return;
    }
    if (!Number.isFinite(courseDurationDays) || courseDurationDays <= 0) {
      setError('Course duration must be a positive number.');
      return;
    }

    const payload = { ...trimmed, courseDurationDays };

    setSaving(true);
    try {
      if (isEdit) {
        await updateStudent(initial.id, payload);
      } else {
        await addStudent(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Could not save student.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600">Registration No</label>
            <input
              type="text"
              value={form.registrationNo}
              onChange={setField('registrationNo')}
              disabled={isEdit}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={setField('name')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Date of Birth</label>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              value={form.dob}
              onChange={setField('dob')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Father/Husband Name</label>
            <input
              type="text"
              value={form.guardianName}
              onChange={setField('guardianName')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Course Duration (Days)</label>
            <input
              type="number"
              min="1"
              value={form.courseDurationDays}
              onChange={setField('courseDurationDays')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600">Batch</label>
            <input
              type="text"
              value={form.batch}
              onChange={setField('batch')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600">Trained In</label>
            <input
              type="text"
              value={form.trainedIn}
              onChange={setField('trainedIn')}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [studentsState, setStudentsState] = useState('loading'); // loading | error | ready
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | student object to edit

  const loadStudents = () => {
    setStudentsState('loading');
    fetchStudents()
      .then((rows) => {
        setStudents(rows);
        setStudentsState('ready');
      })
      .catch(() => setStudentsState('error'));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) => s.registrationNo.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [students, search]);

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete student "${student.name}" (${student.registrationNo})?`)) return;
    await deleteStudent(student.id).catch(() => window.alert('Could not delete student.'));
    loadStudents();
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold text-slate-800">Manage Students</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Reg No or Name"
              className="w-56 rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <button
            type="button"
            onClick={() => setModal('add')}
            className="flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {studentsState === 'loading' && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
            <Loader2 size={16} className="animate-spin" /> Loading students…
          </div>
        )}
        {studentsState === 'error' && (
          <div className="py-10 text-center text-sm text-red-500">Couldn't load students.</div>
        )}
        {studentsState === 'ready' && filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-400">
            {students.length === 0 ? 'No students yet — add your first student above.' : 'No students match your search.'}
          </div>
        )}
        {studentsState === 'ready' && filtered.length > 0 && (
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-400">
                <th className="py-2 pr-4 font-semibold">Reg No</th>
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">DOB</th>
                <th className="py-2 pr-4 font-semibold">Father/Husband</th>
                <th className="py-2 pr-4 font-semibold">Duration</th>
                <th className="py-2 pr-4 font-semibold">Batch</th>
                <th className="py-2 pr-4 font-semibold">Trained In</th>
                <th className="py-2 pr-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 pr-4 font-medium text-slate-700">{s.registrationNo}</td>
                  <td className="py-3 pr-4 text-slate-600">{s.name}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.dob}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.guardianName}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.courseDurationDays}d</td>
                  <td className="py-3 pr-4 text-slate-500">{s.batch}</td>
                  <td className="py-3 pr-4 text-slate-500">{s.trainedIn}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-3 text-slate-400">
                      <button
                        type="button"
                        onClick={() => setModal(s)}
                        className="hover:text-brand-green"
                        aria-label="Edit student"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        className="hover:text-red-500"
                        aria-label="Delete student"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <StudentFormModal
          initial={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            loadStudents();
          }}
        />
      )}
    </div>
  );
}

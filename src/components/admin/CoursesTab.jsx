import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../../lib/api';

export default function CoursesTab() {
  const [courses, setCourses] = useState([]);
  const [coursesState, setCoursesState] = useState('loading'); // loading | error | ready

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
    loadCourses();
  }, []);

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

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Manage Courses</h2>
        <button
          type="button"
          onClick={handleAddCourse}
          className="flex items-center gap-2 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
        >
          <Plus size={16} />
          Add New Course
        </button>
      </div>

      {coursesState === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400">
          <Loader2 size={16} className="animate-spin" /> Loading courses…
        </div>
      )}
      {coursesState === 'error' && (
        <div className="py-10 text-center text-sm text-red-500">Couldn't load courses.</div>
      )}
      {coursesState === 'ready' && courses.length === 0 && (
        <div className="py-10 text-center text-sm text-slate-400">
          No courses yet — add your first course above.
        </div>
      )}
      {coursesState === 'ready' && courses.length > 0 && (
        <ul className="mt-5 flex flex-col gap-2">
          {courses.map((course) => (
            <li
              key={course.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700"
            >
              <span className="truncate pr-2">{course.title}</span>
              <div className="flex shrink-0 gap-3 text-slate-400">
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
  );
}

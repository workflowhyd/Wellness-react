import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
// LandingPage is imported eagerly (not lazy) since it's the route almost
// every visitor lands on directly — lazy-loading it added an extra
// network round-trip on the critical path and measurably hurt mobile
// Speed Index. Admin/verify are rarely-visited routes where splitting
// them out is a clear win with no such downside.
import LandingPage from './components/LandingPage';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CertificateSearch = lazy(() => import('./components/CertificateSearch'));
const CourseDetail = lazy(() => import('./components/CourseDetail'));

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/verify" element={<CertificateSearch />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </HashRouter>
  );
}

export default App;

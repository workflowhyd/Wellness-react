import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import CertificateSearch from './components/CertificateSearch';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify" element={<CertificateSearch />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

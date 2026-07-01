import { useState } from 'react';
import { LayoutDashboard, Home, Search } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import CertificateSearch from './components/CertificateSearch';

const VIEWS = [
  { id: 'landing', label: 'Landing Page', icon: Home, component: LandingPage },
  { id: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard, component: AdminDashboard },
  { id: 'certificate', label: 'Certificate Search', icon: Search, component: CertificateSearch },
];

function App() {
  const [view, setView] = useState('landing');
  const ActiveView = VIEWS.find((v) => v.id === view).component;

  return (
    <div className="min-h-screen bg-white">
      {/* Preview-only view switcher — lets reviewers jump between the three pages */}
      <div className="fixed bottom-4 right-4 z-100 flex gap-1 rounded-full bg-slate-900/90 p-1 shadow-2xl backdrop-blur">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            title={label}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
              view === id ? 'bg-brand-orange text-white' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <ActiveView />
    </div>
  );
}

export default App;

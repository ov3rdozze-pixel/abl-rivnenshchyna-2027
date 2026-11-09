import React, { useState } from 'react';
import { LeagueProvider, useLeague } from './context/LeagueContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { StandingsTable } from './components/StandingsTable';
import { TeamsSection } from './components/TeamsSection';
import { MatchesSection } from './components/MatchesSection';
import { StatsSection } from './components/StatsSection';
import { TopMvpSection } from './components/TopMvpSection';
import { NewsSection } from './components/NewsSection';
import { FinalFourSection } from './components/FinalFourSection';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FirebaseGuideModal } from './components/FirebaseGuideModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, isAdmin } = useLeague();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  const handleOpenAdminLogin = () => {
    if (isAdmin) {
      setActiveTab('admin');
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    setActiveTab('admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e14] text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        onOpenAdminLogin={handleOpenAdminLogin}
        onOpenFirebaseGuide={() => setGuideModalOpen(true)}
      />

      {/* 2. Main Content Route View */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && <HomeView />}

        {activeTab === 'standings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <StandingsTable />
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <TeamsSection />
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <MatchesSection />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <StatsSection />
          </div>
        )}

        {activeTab === 'mvp' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <TopMvpSection />
          </div>
        )}

        {activeTab === 'news' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <NewsSection />
          </div>
        )}

        {activeTab === 'finalfour' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <FinalFourSection />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {isAdmin ? (
              <AdminPanel />
            ) : (
              <div className="max-w-md mx-auto text-center py-16 space-y-4">
                <p className="text-sm text-slate-400">
                  Для доступу до адміністративної панелі необхідно авторизуватися.
                </p>
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-600/30"
                >
                  Увійти в адмін-панель
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        onOpenFirebaseGuide={() => setGuideModalOpen(true)}
        onOpenAdminLogin={handleOpenAdminLogin}
      />

      {/* 4. Modals */}
      {loginModalOpen && (
        <AdminLoginModal
          onClose={() => setLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {guideModalOpen && (
        <FirebaseGuideModal onClose={() => setGuideModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <LeagueProvider>
      <AppContent />
    </LeagueProvider>
  );
}

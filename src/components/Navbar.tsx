import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { Trophy, Shield, Calendar, BarChart3, Newspaper, Users, Home, Settings, Menu, X, LogIn, LogOut, Mail } from 'lucide-react';
import { TelegramIcon, YouTubeIcon, TELEGRAM_URL, YOUTUBE_URL } from './SocialBadges';

interface NavbarProps {
  onOpenAdminLogin: () => void;
  onOpenFirebaseGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminLogin, onOpenFirebaseGuide }) => {
  const { activeTab, setActiveTab, setSelectedTeamId, setSelectedNewsId, setSelectedMatchId, finalFour, isAdmin, logoutAdmin } = useLeague();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    setSelectedTeamId(null);
    setSelectedNewsId(null);
    setSelectedMatchId(null);
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'ГОЛОВНА', icon: Home },
    { id: 'standings', label: 'ТУРНІРНА ТАБЛИЦЯ', icon: Trophy },
    { id: 'teams', label: 'КОМАНДИ', icon: Shield },
    { id: 'matches', label: 'МАТЧІ', icon: Calendar },
    { id: 'stats', label: 'СТАТИСТИКА', icon: BarChart3 },
    { id: 'mvp', label: 'TOP MVP', icon: Trophy },
    { id: 'news', label: 'НОВИНИ', icon: Newspaper },
    {
      id: 'finalfour',
      label: 'ФІНАЛ ЧОТИРЬОХ',
      icon: Trophy,
      badge: finalFour.isActive ? 'LIVE' : 'СКОРО',
      isFinalFour: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0e14]/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40">
      {/* Top Bar: Brand Zone | Nav Links | Social & Admin */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 lg:gap-8">
          
          {/* Zone 1: Brand Wordmark & League Emblem */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-h-[44px]"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner">
              <img
                src="/logos/abl_league.png"
                alt="АБЛ Рівненщини"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-athletic text-xl sm:text-2xl xl:text-3xl font-extrabold tracking-wider text-white uppercase group-hover:text-orange-500 transition-colors whitespace-nowrap">
                АБЛ РІВНЕНЩИНИ
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-orange-400/90 tracking-widest uppercase -mt-1 hidden xs:block">
                СЕЗОН 2026–2027
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs 2xl:text-sm font-bold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                          : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action / Socials & Admin */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Telegram Channel Button */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Офіційний Telegram канал АБЛ Рівне"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#229ED9] bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 rounded-lg transition-colors whitespace-nowrap min-h-[40px]"
            >
              <TelegramIcon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">TELEGRAM</span>
            </a>

            {/* YouTube Channel Button */}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Офіційний YouTube канал АБЛ Рівне (Трансляції)"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#FF0000] bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/30 rounded-lg transition-colors whitespace-nowrap min-h-[40px]"
            >
              <YouTubeIcon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">YOUTUBE</span>
            </a>

            <button
              onClick={onOpenFirebaseGuide}
              title="Безкоштовний хостинг та налаштування бази даних"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors whitespace-nowrap min-h-[40px]"
            >
              <Settings className="w-3.5 h-3.5 text-orange-400" />
              <span>ХОСТИНГ & БАЗА</span>
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold rounded-lg transition-all border whitespace-nowrap min-h-[44px] ${
                    activeTab === 'admin'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-orange-600/20 text-orange-400 border-orange-500/40 hover:bg-orange-600/30'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                  <span className="hidden xs:inline">АДМІН-ПАНЕЛЬ</span>
                  <span className="xs:hidden">АДМІН</span>
                </button>
                <button
                  onClick={logoutAdmin}
                  title="Вийти з адмін-панелі"
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800/60 border border-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/70 rounded-lg transition-all whitespace-nowrap min-h-[44px]"
              >
                <LogIn className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden xs:inline">ВХІД АДМІНА</span>
                <span className="xs:hidden">ВХІД</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Меню навігації"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-[#0f141e] px-4 pt-3 pb-6 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Official Media Channels banner on mobile */}
          <div className="grid grid-cols-2 gap-2 pb-2">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#229ED9]/15 border border-[#229ED9]/40 text-[#229ED9] text-xs font-bold uppercase transition-colors min-h-[44px]"
            >
              <TelegramIcon className="w-4 h-4" />
              <span>TELEGRAM КАНАЛ</span>
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#FF0000]/15 border border-[#FF0000]/40 text-[#FF0000] text-xs font-bold uppercase transition-colors min-h-[44px]"
            >
              <YouTubeIcon className="w-4 h-4" />
              <span>YOUTUBE ТРАНСЛЯЦІЇ</span>
            </a>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-bold tracking-wider uppercase transition-colors min-h-[44px] ${
                    isActive
                      ? 'text-white bg-slate-800 border border-slate-700'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        item.badge === 'LIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenFirebaseGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors min-h-[44px]"
            >
              <Settings className="w-4 h-4 text-orange-400" />
              <span>ІНСТРУКЦІЯ З ХОСТИНГУ ТА БАЗИ ДАНИХ</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  handleNavClick('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-white bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors min-h-[44px]"
              >
                <Settings className="w-4 h-4" />
                <span>ПЕРЕЙТИ В АДМІН-ПАНЕЛЬ</span>
              </button>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs px-1">
              <span className="text-slate-400">Звʼязок:</span>
              <a
                href="mailto:faqablrivne@gmail.com"
                className="text-orange-400 font-mono font-bold hover:underline flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>faqablrivne@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

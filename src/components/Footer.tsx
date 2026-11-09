import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { Trophy, Shield, MapPin, Mail, Settings, ExternalLink } from 'lucide-react';
import { TelegramIcon, YouTubeIcon, TELEGRAM_URL, YOUTUBE_URL } from './SocialBadges';

interface FooterProps {
  onOpenFirebaseGuide: () => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenFirebaseGuide, onOpenAdminLogin }) => {
  const { teams, setActiveTab, setSelectedTeamId, isAdmin } = useLeague();

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07090e] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & League */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                <img src="/logos/abl_league.png" alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-athletic text-2xl font-extrabold text-white uppercase tracking-wider block">
                  АБЛ РІВНЕНЩИНИ
                </span>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block -mt-1">
                  СЕЗОН 2026–2027
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Офіційний вебпортал Аматорської баскетбольної ліги Рівненської області. 
              Об'єднуємо найкращі баскетбольні сили регіону.
            </p>

            {/* Official Contact Info */}
            <div className="pt-2 border-t border-slate-800/80">
              <a
                href="mailto:faqablrivne@gmail.com"
                className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white group transition-colors p-1 -ml-1 rounded"
              >
                <Mail className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform shrink-0" />
                <span className="font-semibold text-slate-400">Звʼязок:</span>
                <span className="text-orange-400 group-hover:text-orange-300 font-mono font-bold underline underline-offset-2">
                  faqablrivne@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* Col 2: Official Social Channels */}
          <div className="space-y-3">
            <h4 className="font-athletic text-sm font-bold uppercase text-white tracking-wider">
              ОФІЦІЙНІ МЕДІА-РЕСУРСИ
            </h4>
            <div className="space-y-2.5">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-[#229ED9]/40 hover:border-[#229ED9] transition-all hover:bg-[#229ED9]/10 min-h-[44px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center shrink-0">
                    <TelegramIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white group-hover:text-[#229ED9] block truncate uppercase">
                      Telegram Канал
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      @ABL_Rivne • Новини та результати
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#229ED9] shrink-0 ml-2" />
              </a>

              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-[#FF0000]/40 hover:border-[#FF0000] transition-all hover:bg-[#FF0000]/10 min-h-[44px]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FF0000]/20 text-[#FF0000] flex items-center justify-center shrink-0">
                    <YouTubeIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white group-hover:text-[#FF0000] block truncate uppercase">
                      YouTube Канал
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      Прямі трансляції та хайлайти
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF0000] shrink-0 ml-2" />
              </a>
            </div>
          </div>

          {/* Col 3: 9 Teams Links */}
          <div className="space-y-3">
            <h4 className="font-athletic text-sm font-bold uppercase text-white tracking-wider">
              КОМАНДИ СЕЗОНУ
            </h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5">
              {teams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTeamClick(t.id)}
                  className="text-left text-[11px] font-semibold text-slate-400 hover:text-orange-400 transition-colors uppercase truncate flex items-center gap-1.5 py-1 min-h-[32px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Navigation & Admin Tools */}
          <div className="space-y-3">
            <h4 className="font-athletic text-sm font-bold uppercase text-white tracking-wider">
              ОРГАНІЗАЦІЯ ТА СИСТЕМА
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('standings');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left py-1"
                >
                  Турнірна таблиця регулярного чемпіонату
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left py-1"
                >
                  Розклад та результати поєдинків
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('mvp');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left py-1"
                >
                  Рейтинг та нагороди TOP MVP
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('finalfour');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left py-1"
                >
                  Фінал чотирьох (Final Four)
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={onOpenFirebaseGuide}
                  className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5 py-1 text-left"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Інструкція з хостингу та Firebase</span>
                </button>
              </li>
              <li>
                {isAdmin ? (
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold py-1 text-left"
                  >
                    Перейти до Адмін-панелі
                  </button>
                ) : (
                  <button
                    onClick={onOpenAdminLogin}
                    className="text-slate-400 hover:text-white py-1 text-left"
                  >
                    Вхід для адміністратора
                  </button>
                )}
              </li>
            </ul>
          </div>

        </div>

        {/* Support the League Project Banner */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b2a] to-slate-900 border border-orange-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <span className="font-athletic text-2xl font-black">₴</span>
            </div>
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest block">
                ПІДТРИМКА РОЗВИТКУ АБЛ РІВНЕНЩИНИ
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white tracking-wide">
                Підтримати проект по картці: <span className="font-mono text-orange-300 font-black tracking-wider selection:bg-white selection:text-black">4400005541086127</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText('4400005541086127');
              alert('Номер картки скопійовано: 4400005541086127');
            }}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-600/30 whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-95"
            title="Скопіювати номер банківської картки"
          >
            Скопіювати картку
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} АБЛ РІВНЕНЩИНИ. Усі права захищено. Офіційний сезон 2026–2027.
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <a
              href="mailto:faqablrivne@gmail.com"
              className="text-slate-400 hover:text-orange-400 font-medium transition-colors"
            >
              Звʼязок: <span className="text-orange-400 underline">faqablrivne@gmail.com</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <span>м. Рівне, Україна</span>
            <span className="hidden sm:inline">•</span>
            <span>Федерація баскетболу Рівненщини</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { Trophy, Calendar, ShieldCheck, Flame, ChevronRight, Video, Send } from 'lucide-react';
import { TelegramIcon, YouTubeIcon, TELEGRAM_URL, YOUTUBE_URL } from './SocialBadges';

export const HeroBanner: React.FC = () => {
  const { teams, setActiveTab, setSelectedTeamId } = useLeague();

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#111724] via-[#0d121c] to-[#0b0e14] border-b border-slate-800">
      {/* Background court lines pattern & glows */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-600/30 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>ОФІЦІЙНИЙ ВЕБПОРТАЛ • СЕЗОН 2026–2027</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-athletic text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[0.95] break-words">
                АБЛ РІВНЕНЩИНИ
              </h1>
              <p className="text-lg sm:text-2xl font-bold text-slate-300 uppercase tracking-wide">
                Аматорська баскетбольна ліга Рівненської області
              </p>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Головна баскетбольна арена краю. 9 найсильніших команд Рівного, Вараша, Костополя, Сарн та Шпанова 
              змагаються за звання чемпіона та путівки до фінального турніру чотирьох.
            </p>

            {/* CTAs & Official Media Channels */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
              <button
                onClick={() => setActiveTab('standings')}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-orange-600/30 hover:scale-[1.02] min-h-[44px] flex-1 sm:flex-initial"
              >
                <Trophy className="w-4 h-4" />
                <span>ТУРНІРНА ТАБЛИЦЯ</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('matches')}
                className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-bold text-xs sm:text-sm tracking-wide transition-all border border-slate-700 hover:scale-[1.02] min-h-[44px] flex-1 sm:flex-initial"
              >
                <Calendar className="w-4 h-4 text-orange-400" />
                <span>КАЛЕНДАР МАТЧІВ</span>
              </button>

              {/* Official Telegram Link */}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/40 font-bold text-xs sm:text-sm tracking-wide transition-all hover:scale-[1.02] min-h-[44px] flex-1 sm:flex-initial"
                title="Офіційний Telegram-канал АБЛ Рівне"
              >
                <TelegramIcon className="w-4 h-4 shrink-0" />
                <span>TELEGRAM КАНАЛ</span>
              </a>

              {/* Official YouTube Link */}
              <a
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000]/25 text-[#FF0000] border border-[#FF0000]/40 font-bold text-xs sm:text-sm tracking-wide transition-all hover:scale-[1.02] min-h-[44px] flex-1 sm:flex-initial"
                title="Офіційний YouTube-канал АБЛ Рівне"
              >
                <YouTubeIcon className="w-4 h-4 shrink-0" />
                <span>YOUTUBE ТРАНСЛЯЦІЇ</span>
              </a>
            </div>

            {/* Key League Facts Strip */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="font-athletic text-2xl sm:text-3xl font-extrabold text-white">9</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">КОМАНД-УЧАСНИЦЬ</div>
              </div>
              <div>
                <div className="font-athletic text-2xl sm:text-3xl font-extrabold text-orange-400">18</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ТУРІВ СЕЗОНУ</div>
              </div>
              <div>
                <div className="font-athletic text-2xl sm:text-3xl font-extrabold text-white">4</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">У ФІНАЛІ ЧОТИРЬОХ</div>
              </div>
            </div>

          </div>

          {/* Official League Emblem Hero Card */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 border border-slate-700/80 shadow-2xl flex flex-col items-center justify-center">
                <img
                  src="/logos/abl_league.png"
                  alt="Офіційна емблема АБЛ Рівненщини"
                  className="w-44 h-44 sm:w-56 sm:h-56 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="text-center mt-3">
                  <div className="font-athletic text-lg font-extrabold text-white tracking-widest uppercase">
                    АБЛ РІВНЕНЩИНИ
                  </div>
                  <div className="text-[11px] font-semibold text-orange-400 tracking-wider">
                    ОФІЦІЙНА ЕМБЛЕМА
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Marquee Strip of 9 Teams */}
        <div className="mt-12 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              КОМАНДИ СЕЗОНУ 2026–2027 (КЛІКНІТЬ ДЛЯ ПЕРЕГЛЯДУ)
            </span>
            <button
              onClick={() => setActiveTab('teams')}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>Всі команди</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamClick(team.id)}
                className="group relative flex flex-col items-center p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 transition-all hover:-translate-y-1"
                title={team.name}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 p-1 flex items-center justify-center">
                  <img
                    src={team.logoUrl}
                    alt={team.name}
                    className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="mt-2 text-[10px] sm:text-[11px] font-extrabold text-slate-300 group-hover:text-white uppercase tracking-wider text-center line-clamp-1">
                  {team.shortName}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

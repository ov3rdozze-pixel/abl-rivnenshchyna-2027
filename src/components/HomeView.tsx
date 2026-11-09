import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { HeroBanner } from './HeroBanner';
import { StandingsTable } from './StandingsTable';
import { Trophy, Calendar, Newspaper, ArrowRight, Shield, Flame, MapPin, Clock } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { matches, teams, news, setActiveTab, setSelectedMatchId, setSelectedNewsId, setSelectedTeamId, finalFour } = useLeague();

  const nextUpcoming = matches
    .filter((m) => m.status === 'upcoming')
    .slice(0, 4);

  const recentNews = news.slice(0, 3);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Banner */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* 2. Standings & Upcoming Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Standings Table (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-500" />
                  <span>ТУРНІРНЕ СТАНОВИЩЕ</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Регулярний чемпіонат • Топ-4 виходять до Фіналу чотирьох
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('standings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider flex items-center gap-1"
              >
                <span>Детальна таблиця</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <StandingsTable compact={true} />
          </div>

          {/* Right: Upcoming Matches & Final Four Teaser (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Final Four Status Card */}
            <div
              onClick={() => {
                setActiveTab('finalfour');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b1c2b] via-[#121622] to-[#0c1017] border border-orange-500/30 p-5 shadow-xl hover:border-orange-500/60 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>{finalFour.isActive ? 'АКТИВНА СТАДІЯ' : 'НЕАКТИВНО • СКОРО'}</span>
                </span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              <h4 className="font-athletic text-xl font-bold uppercase text-white group-hover:text-orange-400 transition-colors">
                ФІНАЛ ЧОТИРЬОХ — FINAL FOUR
              </h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {finalFour.isActive
                  ? 'Перегляньте актуальну турнірну сітку, півфінали та фінальний матч за кубок АБЛ!'
                  : 'Завершальний етап чемпіонату для 4 найкращих команд ліги. Буде активовано після регулярного сезону.'}
              </p>

              <div className="mt-3 text-xs font-bold text-orange-400 flex items-center gap-1">
                <span>Переглянути розділ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Top MVP Teaser Card */}
            <div
              onClick={() => {
                setActiveTab('mvp');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1828] via-[#131622] to-[#0c1017] border border-amber-500/30 p-5 shadow-xl hover:border-amber-500/60 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <span>TOP MVP ТУРУ</span>
                </span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>

              <h4 className="font-athletic text-xl font-bold uppercase text-white group-hover:text-amber-300 transition-colors">
                РЕЙТИНГ MVP ТА ЛАУРЕАТИ
              </h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                Дізнайтеся, хто з гравців найчастіше ставав найціннішим гравцем туру регулярного чемпіонату АБЛ.
              </p>

              <div className="mt-3 text-xs font-bold text-amber-400 flex items-center gap-1">
                <span>Переглянути рейтинг MVP</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Upcoming Games Strip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-athletic text-lg font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>НАЙБЛИЖЧІ ПОЄДИНКИ</span>
                </h4>
                <button
                  onClick={() => {
                    setActiveTab('matches');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase"
                >
                  Весь календар
                </button>
              </div>

              <div className="space-y-2.5">
                {nextUpcoming.map((m) => {
                  const home = teams.find((t) => t.id === m.homeTeamId);
                  const away = teams.find((t) => t.id === m.awayTeamId);
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMatchId(m.id)}
                      className="group cursor-pointer p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-orange-400">ТУР {m.round}</span>
                        <span>{m.date} • {m.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img src={home?.logoUrl} alt="" className="w-5 h-5 object-contain shrink-0" />
                          <span className="text-xs font-bold text-white truncate">{home?.shortName}</span>
                        </div>
                        <span className="font-athletic text-xs font-bold text-slate-500 px-1">VS</span>
                        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end text-right">
                          <span className="text-xs font-bold text-white truncate">{away?.shortName}</span>
                          <img src={away?.logoUrl} alt="" className="w-5 h-5 object-contain shrink-0" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Media Channels Card in Sidebar */}
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 via-[#101522] to-[#0c1017] border border-slate-800 p-5 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="font-athletic text-base font-bold uppercase text-white tracking-wider">
                  ОФІЦІЙНІ МЕДІА АБЛ
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Слідкуйте за матчами в прямому ефірі та першими дізнавайтесь результати у наших каналах:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                <a
                  href="https://t.me/ABL_Rivne"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/40 text-[#229ED9] transition-all min-h-[44px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#229ED9] text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.965z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block uppercase truncate">TELEGRAM КАНАЛ</span>
                      <span className="text-[10px] text-slate-400 block truncate">@ABL_Rivne</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </a>

                <a
                  href="https://youtube.com/channel/UCzIJOBYof8BzFFOnEWOZimQ?si=awpahC04gFusLSxR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000]/25 border border-[#FF0000]/40 text-[#FF0000] transition-all min-h-[44px] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block uppercase truncate">YOUTUBE ТРАНСЛЯЦІЇ</span>
                      <span className="text-[10px] text-slate-400 block truncate">АБЛ Рівне Відео</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Latest News Strip */}
        <div className="space-y-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-orange-500" />
                <span>ОСТАННІ НОВИНИ АБЛ</span>
              </h3>
              <p className="text-xs text-slate-400">
                Офіційні прес-релізи та новини баскетбольної спільноти краю
              </p>
            </div>
            <button
              onClick={() => {
                setActiveTab('news');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-wider flex items-center gap-1"
            >
              <span>Всі новини</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recentNews.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedNewsId(item.id);
                  setActiveTab('news');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 p-5 transition-all hover:-translate-y-1 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-40 rounded-xl bg-slate-950 p-3 flex items-center justify-center border border-slate-800">
                    <img
                      src={item.imageUrl || '/logos/abl_league.png'}
                      alt=""
                      className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-semibold text-[10px] uppercase">
                      {item.category}
                    </span>
                    <span>{item.publishedAt}</span>
                  </div>
                  <h4 className="font-athletic text-lg font-bold uppercase text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-2 text-xs font-bold text-orange-400 flex items-center gap-1">
                  <span>Читати далі</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { Trophy, Shield, Calendar, MapPin, Clock, Award, AlertCircle, Settings, CheckCircle2 } from 'lucide-react';

export const FinalFourSection: React.FC = () => {
  const { finalFour, teams, standings, setActiveTab, setSelectedTeamId, isAdmin } = useLeague();

  const handleTeamClick = (teamId?: string) => {
    if (!teamId) return;
    setSelectedTeamId(teamId);
    setActiveTab('teams');
  };

  // 1. INACTIVE STATE (Default at start of season)
  if (!finalFour.isActive) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        
        {/* Banner with Trophy */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-[#101624] to-[#0b0e14] border border-slate-800 p-8 sm:p-14 text-center shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>СТАТУС: СКОРО • РОЗДІЛ БУДЕ АКТИВОВАНО ПІСЛЯ РЕГУЛЯРНОГО ЧЕМПІОНАТУ</span>
            </div>

            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-b from-amber-500/20 to-orange-600/10 border border-amber-500/40 p-4 flex items-center justify-center shadow-xl">
              <Trophy className="w-14 h-14 text-amber-400 drop-shadow" />
            </div>

            <div className="space-y-2">
              <h1 className="font-athletic text-4xl sm:text-6xl font-extrabold uppercase text-white tracking-wide leading-none">
                ФІНАЛ ЧОТИРЬОХ — FINAL FOUR
              </h1>
              <p className="text-base sm:text-lg font-bold text-orange-400 uppercase tracking-widest">
                АБЛ РІВНЕНЩИНИ • СЕЗОН 2026–2027
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              «Фінал чотирьох» — головна баскетбольна подія та кульмінація чемпіонату. Чотири найсильніші команди 
              регулярного сезону за підсумками 18 турів зійдуться у безкомпромісній кубковій сітці за звання 
              чемпіона Аматорської баскетбольної ліги Рівненщини.
            </p>

            {/* Explanation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-orange-400 uppercase">1. Кваліфікація</div>
                <div className="text-sm font-semibold text-white">Топ-4 регулярного сезону</div>
                <div className="text-xs text-slate-400">Лише перші чотири колективи турнірної таблиці отримають путівки.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-orange-400 uppercase">2. Формат матчів</div>
                <div className="text-sm font-semibold text-white">Півфінали та Гранд Фінал</div>
                <div className="text-xs text-slate-400">1-е місце проти 4-го, 2-е проти 3-го, матч за 3-є місце та фінал за кубок.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-orange-400 uppercase">3. Активація сітки</div>
                <div className="text-sm font-semibold text-white">Офіційне рішення оргкомітету</div>
                <div className="text-xs text-slate-400">Турнірна сітка відкриється для глядачів після завершення 1-го етапу.</div>
              </div>
            </div>

            {/* Admin CTA if logged in */}
            {isAdmin ? (
              <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-xs text-slate-400">Ви увійшли як адміністратор ліги:</span>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-600/30"
                >
                  <Settings className="w-4 h-4" />
                  <span>НАЛАШТУВАТИ ТА АКТИВУВАТИ ФІНАЛ ЧОТИРЬОХ</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 text-xs text-slate-500">
                Очікуйте офіційного оголошення розкладу та дат проведення від оргкомітету АБЛ.
              </div>
            )}

          </div>
        </div>

      </div>
    );
  }

  // 2. ACTIVE STATE (Configured and activated by Admin)
  const sf1Home = teams.find((t) => t.id === finalFour.semiFinal1.homeTeamId);
  const sf1Away = teams.find((t) => t.id === finalFour.semiFinal1.awayTeamId);

  const sf2Home = teams.find((t) => t.id === finalFour.semiFinal2.homeTeamId);
  const sf2Away = teams.find((t) => t.id === finalFour.semiFinal2.awayTeamId);

  const finalHome = teams.find((t) => t.id === finalFour.finalMatch.homeTeamId);
  const finalAway = teams.find((t) => t.id === finalFour.finalMatch.awayTeamId);

  const thirdHome = teams.find((t) => t.id === finalFour.thirdPlaceMatch.homeTeamId);
  const thirdAway = teams.find((t) => t.id === finalFour.thirdPlaceMatch.awayTeamId);

  const champion = teams.find((t) => t.id === finalFour.championTeamId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-orange-500" />
            <h2 className="font-athletic text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-wide">
              {finalFour.title || 'ФІНАЛ ЧОТИРЬОХ — FINAL FOUR'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Офіційна турнірна сітка плей-оф сезону {finalFour.season}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>АКТИВНА СТАДІЯ</span>
          </span>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition-colors"
            >
              Редагувати сітку
            </button>
          )}
        </div>
      </div>

      {/* Champion Banner if determined */}
      {champion && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600/30 via-orange-600/20 to-amber-500/30 border-2 border-amber-500/70 p-6 sm:p-8 shadow-2xl text-center space-y-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-slate-950 p-2 border border-amber-500/50 shadow-xl flex items-center justify-center">
            <img
              src={champion.logoUrl}
              alt={champion.name}
              className="w-full h-full object-contain filter drop-shadow"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-300 uppercase tracking-widest">
              ЧЕМПІОН АБЛ РІВНЕНЩИНИ СЕЗОНУ 2026–2027
            </div>
            <h3 className="font-athletic text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider mt-1">
              {champion.name}
            </h3>
          </div>
          {finalFour.mvpPlayerName && (
            <div className="inline-block px-4 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
              MVP ФІНАЛУ ЧОТИРЬОХ: <span className="text-white font-extrabold">{finalFour.mvpPlayerName}</span>
            </div>
          )}
        </div>
      )}

      {/* Tournament Bracket Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SEMI FINALS COLUMN */}
        <div className="space-y-6">
          <h3 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-orange-500" />
            <span>ПІВФІНАЛЬНІ ПОЄДИНКИ</span>
          </h3>

          {/* Semi Final 1 */}
          <div className="p-5 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-bold text-orange-400">ПІВФІНАЛ 1</span>
              <span>{finalFour.semiFinal1.date} • {finalFour.semiFinal1.time}</span>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => handleTeamClick(sf1Home?.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={sf1Home?.logoUrl} alt="" className="w-8 h-8 object-contain shrink-0" />
                  <span className="font-extrabold text-white text-xs sm:text-sm uppercase truncate">
                    {sf1Home ? sf1Home.name : 'УЧАСНИК 1'}
                  </span>
                </div>
                <span className="font-athletic text-xl font-bold text-orange-400 px-2 font-mono">
                  {finalFour.semiFinal1.homeScore ?? '—'}
                </span>
              </div>

              <div
                onClick={() => handleTeamClick(sf1Away?.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={sf1Away?.logoUrl} alt="" className="w-8 h-8 object-contain shrink-0" />
                  <span className="font-extrabold text-white text-xs sm:text-sm uppercase truncate">
                    {sf1Away ? sf1Away.name : 'УЧАСНИК 4'}
                  </span>
                </div>
                <span className="font-athletic text-xl font-bold text-orange-400 px-2 font-mono">
                  {finalFour.semiFinal1.awayScore ?? '—'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="truncate">{finalFour.semiFinal1.venue}</span>
            </div>
          </div>

          {/* Semi Final 2 */}
          <div className="p-5 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-bold text-orange-400">ПІВФІНАЛ 2</span>
              <span>{finalFour.semiFinal2.date} • {finalFour.semiFinal2.time}</span>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => handleTeamClick(sf2Home?.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={sf2Home?.logoUrl} alt="" className="w-8 h-8 object-contain shrink-0" />
                  <span className="font-extrabold text-white text-xs sm:text-sm uppercase truncate">
                    {sf2Home ? sf2Home.name : 'УЧАСНИК 2'}
                  </span>
                </div>
                <span className="font-athletic text-xl font-bold text-orange-400 px-2 font-mono">
                  {finalFour.semiFinal2.homeScore ?? '—'}
                </span>
              </div>

              <div
                onClick={() => handleTeamClick(sf2Away?.id)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={sf2Away?.logoUrl} alt="" className="w-8 h-8 object-contain shrink-0" />
                  <span className="font-extrabold text-white text-xs sm:text-sm uppercase truncate">
                    {sf2Away ? sf2Away.name : 'УЧАСНИК 3'}
                  </span>
                </div>
                <span className="font-athletic text-xl font-bold text-orange-400 px-2 font-mono">
                  {finalFour.semiFinal2.awayScore ?? '—'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="truncate">{finalFour.semiFinal2.venue}</span>
            </div>
          </div>

        </div>

        {/* FINALS COLUMN */}
        <div className="space-y-6">
          <h3 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-amber-400" />
            <span>ГРАНД ФІНАЛ ТА МАТЧ ЗА 3-Є МІСЦЕ</span>
          </h3>

          {/* Grand Final */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#182030] to-[#0e141f] border-2 border-amber-500/60 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-700/80 text-amber-300">
              <span className="font-extrabold flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>ГРАНД ФІНАЛ ЗА ЧЕМПІОНСЬКИЙ КУБОК</span>
              </span>
              <span>{finalFour.finalMatch.date} • {finalFour.finalMatch.time}</span>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => handleTeamClick(finalHome?.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={finalHome?.logoUrl} alt="" className="w-9 h-9 object-contain shrink-0" />
                  <span className="font-extrabold text-white text-sm uppercase truncate">
                    {finalHome ? finalHome.name : 'ФІНАЛІСТ 1 (ПЕРЕМОЖЕЦЬ ПФ1)'}
                  </span>
                </div>
                <span className="font-athletic text-2xl font-extrabold text-amber-400 px-3 font-mono">
                  {finalFour.finalMatch.homeScore ?? '—'}
                </span>
              </div>

              <div
                onClick={() => handleTeamClick(finalAway?.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={finalAway?.logoUrl} alt="" className="w-9 h-9 object-contain shrink-0" />
                  <span className="font-extrabold text-white text-sm uppercase truncate">
                    {finalAway ? finalAway.name : 'ФІНАЛІСТ 2 (ПЕРЕМОЖЕЦЬ ПФ2)'}
                  </span>
                </div>
                <span className="font-athletic text-2xl font-extrabold text-amber-400 px-3 font-mono">
                  {finalFour.finalMatch.awayScore ?? '—'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{finalFour.finalMatch.venue}</span>
            </div>
          </div>

          {/* 3rd place match if enabled */}
          {finalFour.thirdPlaceMatch.enabled && (
            <div className="p-5 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 text-slate-400">
                <span className="font-bold text-slate-300">МАТЧ ЗА 3-Є МІСЦЕ (БРОНЗА)</span>
                <span>{finalFour.thirdPlaceMatch.date} • {finalFour.thirdPlaceMatch.time}</span>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => handleTeamClick(thirdHome?.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={thirdHome?.logoUrl} alt="" className="w-7 h-7 object-contain shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm uppercase truncate">
                      {thirdHome ? thirdHome.name : 'УЧАСНИК МАТЧУ ЗА 3-Є МІСЦЕ'}
                    </span>
                  </div>
                  <span className="font-athletic text-lg font-bold text-slate-300 px-2 font-mono">
                    {finalFour.thirdPlaceMatch.homeScore ?? '—'}
                  </span>
                </div>

                <div
                  onClick={() => handleTeamClick(thirdAway?.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={thirdAway?.logoUrl} alt="" className="w-7 h-7 object-contain shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm uppercase truncate">
                      {thirdAway ? thirdAway.name : 'УЧАСНИК МАТЧУ ЗА 3-Є МІСЦЕ'}
                    </span>
                  </div>
                  <span className="font-athletic text-lg font-bold text-slate-300 px-2 font-mono">
                    {finalFour.thirdPlaceMatch.awayScore ?? '—'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span className="truncate">{finalFour.thirdPlaceMatch.venue}</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

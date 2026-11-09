import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { Award, Flame, Trophy, Shield, Calendar, User, ArrowUpRight, Plus, Star } from 'lucide-react';

export const TopMvpSection: React.FC = () => {
  const { mvpAwards, mvpLeaderboard, teams, setActiveTab, setSelectedTeamId, isAdmin } = useLeague();
  const [selectedRoundFilter, setSelectedRoundFilter] = useState<string>('all');

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rounds = Array.from(new Set(mvpAwards.map((a) => a.round))).sort((a, b) => b - a);

  const filteredAwards = selectedRoundFilter === 'all'
    ? mvpAwards
    : mvpAwards.filter((a) => a.round === parseInt(selectedRoundFilter, 10));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-500" />
            <h2 className="font-athletic text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-wide">
              TOP MVP ТУРУ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Офіційний рейтинг найцінніших гравців турів АБЛ Рівненщини • Сезон 2026–2027
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-orange-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>КЕРУВАТИ MVP ТУРУ В АДМІНЦІ</span>
          </button>
        )}
      </div>

      {/* 1. MVP Leaderboard (Рейтинг гравців за кількістю MVP) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-athletic text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
              ЗАГАЛЬНИЙ РЕЙТИНГ MVP ТУРУ (КІЛЬКІСТЬ НАГОРОД)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {mvpLeaderboard.length} лауреатів у сезоні
          </span>
        </div>

        {mvpLeaderboard.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm">
            Нагороди MVP ще не призначено. Очікуйте завершення найближчих турів чемпіонату або додайте лауреата в адмін-панелі.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mvpLeaderboard.map((leader, index) => {
              const team = teams.find((t) => t.id === leader.teamId);
              const isFirst = index === 0;

              return (
                <div
                  key={`${leader.playerName}_${leader.teamId}`}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${
                    isFirst
                      ? 'from-amber-600/20 via-slate-900 to-[#0e141f] border-2 border-amber-500/60 shadow-amber-500/10'
                      : 'from-slate-900 to-[#0c1017] border border-slate-800'
                  } p-5 shadow-xl flex flex-col justify-between space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] font-extrabold text-orange-400 uppercase">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{leader.mvpCount}x MVP ТУРУ</span>
                    </div>
                    <span className="font-athletic text-lg font-bold text-slate-400">
                      #{index + 1} В РЕЙТИНГУ
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800">
                      <img
                        src={team?.logoUrl}
                        alt={team?.name}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-white text-base uppercase tracking-wide truncate">
                        {leader.playerName}
                      </h4>
                      <button
                        onClick={() => handleTeamClick(leader.teamId)}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 uppercase truncate block text-left"
                      >
                        {team?.name}
                      </button>
                    </div>
                  </div>

                  {/* List of tours won */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                      Визнання за турами:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {leader.awards.map((award) => (
                        <span
                          key={award.id}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-orange-400 text-[11px] font-bold"
                          title={award.matchInfo || `Тур ${award.round}`}
                        >
                          Тур {award.round} ({award.points} очк, {award.rebounds} підб)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Round by Round MVP Awards Showcase */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <h3 className="font-athletic text-xl sm:text-2xl font-bold uppercase text-white tracking-wide">
              ХРОНІКА ТА ПРОТОКОЛИ MVP ЗА ТУРАМИ
            </h3>
          </div>

          {rounds.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Фільтр за туром:</span>
              <select
                value={selectedRoundFilter}
                onChange={(e) => setSelectedRoundFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 font-medium focus:outline-none focus:border-orange-500"
              >
                <option value="all">Усі тури</option>
                {rounds.map((r) => (
                  <option key={r} value={r.toString()}>
                    Тур {r}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredAwards.length === 0 ? (
          <p className="text-xs text-slate-400 p-6 bg-slate-900 rounded-xl border border-slate-800 text-center">
            Немає зареєстрованих нагород за обраним фільтром.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredAwards.map((award) => {
              const team = teams.find((t) => t.id === award.teamId);

              return (
                <div
                  key={award.id}
                  className="rounded-2xl bg-[#0f141e] border border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-center md:items-start justify-between gap-6"
                >
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 p-2 border border-slate-700/80 shrink-0 flex items-center justify-center shadow-lg">
                      <img
                        src={team?.logoUrl}
                        alt={team?.name}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-orange-600/20 text-orange-400 border border-orange-500/30 text-xs font-extrabold uppercase">
                        <Award className="w-3.5 h-3.5 text-orange-400" />
                        <span>MVP {award.round}-ГО ТУРУ АБЛ</span>
                      </div>

                      <h4 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
                        {award.playerName}
                      </h4>

                      <button
                        onClick={() => handleTeamClick(award.teamId)}
                        className="text-xs font-bold text-slate-300 hover:text-orange-400 transition-colors uppercase block"
                      >
                        {team?.name}
                      </button>

                      {award.matchInfo && (
                        <div className="text-xs text-slate-400">
                          Поєдинок: <strong className="text-slate-200">{award.matchInfo}</strong>
                        </div>
                      )}

                      {award.description && (
                        <p className="text-xs text-slate-300 italic pt-1 max-w-xl">
                          «{award.description}»
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stat Box Strip (Responsive Grid) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center w-full md:w-auto shrink-0">
                    <div className="px-2.5 py-1 rounded bg-slate-900/60">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">ОЧКИ</div>
                      <div className="font-athletic text-2xl font-extrabold text-orange-400">
                        {award.points}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-slate-900/60">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">ПІДБИРАННЯ</div>
                      <div className="font-athletic text-2xl font-extrabold text-white">
                        {award.rebounds}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded bg-slate-900/60">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">ПЕРЕДАЧІ</div>
                      <div className="font-athletic text-2xl font-extrabold text-white">
                        {award.assists}
                      </div>
                    </div>
                    {award.efficiency !== undefined ? (
                      <div className="px-2.5 py-1 rounded bg-slate-900/60">
                        <div className="text-[10px] font-bold text-emerald-400 uppercase">РЕЙТИНГ</div>
                        <div className="font-athletic text-2xl font-extrabold text-emerald-400">
                          +{award.efficiency}
                        </div>
                      </div>
                    ) : (
                      <div className="px-2.5 py-1 rounded bg-slate-900/60">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">ТУР</div>
                        <div className="font-athletic text-2xl font-extrabold text-white">
                          #{award.round}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

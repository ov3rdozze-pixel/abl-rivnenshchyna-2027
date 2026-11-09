import React, { useState, useMemo } from 'react';
import { useLeague } from '../context/LeagueContext';
import { MatchDetailModal } from './MatchDetailModal';
import { Calendar, Filter, Clock, MapPin, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const MatchesSection: React.FC = () => {
  const { matches, teams, selectedMatchId, setSelectedMatchId, setActiveTab, setSelectedTeamId, isAdmin } = useLeague();
  const [activeTab, setActiveTabLocal] = useState<'upcoming' | 'completed'>('upcoming');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [roundFilter, setRoundFilter] = useState<string>('all');

  // Extract all unique rounds
  const rounds = useMemo(() => {
    const set = new Set<number>();
    matches.forEach((m) => set.add(m.round));
    return Array.from(set).sort((a, b) => a - b);
  }, [matches]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (m.status !== activeTab) return false;
      if (teamFilter !== 'all' && m.homeTeamId !== teamFilter && m.awayTeamId !== teamFilter) {
        return false;
      }
      if (roundFilter !== 'all' && m.round !== parseInt(roundFilter, 10)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.date + ' ' + a.time).getTime();
      const timeB = new Date(b.date + ' ' + b.time).getTime();
      return activeTab === 'upcoming' ? timeA - timeB : timeB - timeA;
    });
  }, [matches, activeTab, teamFilter, roundFilter]);

  const upcomingCount = matches.filter((m) => m.status === 'upcoming').length;
  const completedCount = matches.filter((m) => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
              КАЛЕНДАР ТА МАТЧІ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Розклад регулярного чемпіонату АБЛ Рівненщини • Сезон 2026–2027
          </p>
        </div>

        {/* Tab switchers: Upcoming / Completed */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTabLocal('upcoming')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              activeTab === 'upcoming'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            НАЙБЛИЖЧІ МАТЧІ ({upcomingCount})
          </button>
          <button
            onClick={() => setActiveTabLocal('completed')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
              activeTab === 'completed'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ЗІГРАНІ МАТЧІ ({completedCount})
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
        {/* Team filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-400 shrink-0" />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-orange-500"
          >
            <option value="all">Всі дев'ять команд</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Round filter */}
        <div>
          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-orange-500"
          >
            <option value="all">Всі тури</option>
            {rounds.map((r) => (
              <option key={r} value={r.toString()}>
                Тур {r}
              </option>
            ))}
          </select>
        </div>

        {/* Admin hint */}
        {isAdmin && (
          <div className="flex items-center justify-end">
            <button
              onClick={() => setActiveTab('admin')}
              className="text-xs font-bold text-orange-400 hover:underline"
            >
              + Додати або внести рахунок матчу
            </button>
          </div>
        )}
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-slate-300">
            {activeTab === 'completed'
              ? 'Зіграних матчів за обраними фільтрами поки немає.'
              : 'Запланованих матчів за обраними фільтрами поки немає.'}
          </p>
          <p className="text-xs text-slate-500">
            Спробуйте змінити фільтр команд або туру, або внесіть результати в адмін-панелі.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => {
            const home = teams.find((t) => t.id === m.homeTeamId);
            const away = teams.find((t) => t.id === m.awayTeamId);

            return (
              <div
                key={m.id}
                onClick={() => setSelectedMatchId(m.id)}
                className="group cursor-pointer rounded-2xl bg-gradient-to-b from-[#111622] to-[#0c1017] border border-slate-800 hover:border-orange-500/50 p-5 shadow-lg hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 space-y-4"
              >
                {/* Card Top: Round, Date, Status */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 uppercase tracking-wide">
                      ТУР {m.round}
                    </span>
                    <span className="text-slate-400 font-medium">
                      {m.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-orange-400" />
                    <span>{m.time}</span>
                  </div>
                </div>

                {/* Teams & Score */}
                <div className="grid grid-cols-12 items-center gap-1 sm:gap-2 py-1">
                  
                  {/* Home Team */}
                  <div className="col-span-5 flex items-center gap-1.5 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800 shadow group-hover:scale-105 transition-transform">
                      <img
                        src={home?.logoUrl}
                        alt={home?.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-white text-[11px] sm:text-xs md:text-sm uppercase tracking-wide truncate group-hover:text-orange-400 transition-colors" title={home?.name}>
                        {home?.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {home?.city}
                      </span>
                    </div>
                  </div>

                  {/* Score or VS */}
                  <div className="col-span-2 text-center px-0.5">
                    {m.status === 'completed' ? (
                      <div className="font-athletic text-xl sm:text-2xl md:text-3xl font-extrabold text-orange-400 tracking-wider">
                        {m.homeScore} : {m.awayScore}
                      </div>
                    ) : (
                      <div className="font-athletic text-base sm:text-lg font-bold text-slate-500">
                        VS
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="col-span-5 flex items-center justify-end gap-1.5 sm:gap-3 text-right min-w-0">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-extrabold text-white text-[11px] sm:text-xs md:text-sm uppercase tracking-wide truncate group-hover:text-orange-400 transition-colors" title={away?.name}>
                        {away?.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {away?.city}
                      </span>
                    </div>
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800 shadow group-hover:scale-105 transition-transform">
                      <img
                        src={away?.logoUrl}
                        alt={away?.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                </div>

                {/* Venue and Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{m.venue}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 font-bold group-hover:text-orange-300 shrink-0">
                    <span>ПРОТОКОЛ</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedMatchId && (
        <MatchDetailModal
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
        />
      )}
    </div>
  );
};

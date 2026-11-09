import React, { useState, useMemo } from 'react';
import { useLeague } from '../context/LeagueContext';
import { BarChart3, Trophy, Flame, Shield, ArrowUpRight } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { players, teams, standings, setSelectedTeamId, setActiveTab } = useLeague();
  const [category, setCategory] = useState<'points' | 'rebounds' | 'assists' | 'steals' | 'blocks'>('points');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');

  const categories = [
    { id: 'points', label: 'ОЧКИ', title: 'Найкращі бомбардири' },
    { id: 'rebounds', label: 'ПІДБИРАННЯ', title: 'Лідери за підбираннями' },
    { id: 'assists', label: 'ПЕРЕДАЧІ', title: 'Лідери за результативними передачами' },
    { id: 'steals', label: 'ПЕРЕХОПЛЕННЯ', title: 'Лідери за перехопленнями' },
    { id: 'blocks', label: 'БЛОКШОТИ', title: 'Лідери за блокшотами' },
  ];

  // Filter players
  const filteredPlayers = useMemo(() => {
    let list = [...players];
    if (selectedTeamFilter !== 'all') {
      list = list.filter((p) => p.teamId === selectedTeamFilter);
    }
    // Sort according to category
    list.sort((a, b) => {
      const valA = a.stats[category] || 0;
      const valB = b.stats[category] || 0;
      return valB - valA;
    });
    return list;
  }, [players, selectedTeamFilter, category]);

  const top3 = filteredPlayers.slice(0, 3);
  const remaining = filteredPlayers.slice(3, 15);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
  };

  const isAllZero = players.every((p) => p.stats[category] === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
              СТАТИСТИКА ЛІГИ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Індивідуальні та командні показники сезону 2026–2027
          </p>
        </div>

        {/* Team filter dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTeamFilter}
            onChange={(e) => setSelectedTeamFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:border-orange-500"
          >
            <option value="all">Всі команди ліги</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 ${
              category === c.id
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isAllZero && (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs flex items-center justify-between">
          <span>
            ℹ️ Показники оновлюються автоматично після внесення протоколів матчів та індивідуальної статистики в адмін-панелі.
          </span>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((player, idx) => {
          const team = teams.find((t) => t.id === player.teamId);
          const podiumColors = [
            'from-amber-500/20 to-slate-900 border-amber-500/50',
            'from-slate-400/20 to-slate-900 border-slate-400/50',
            'from-amber-700/20 to-slate-900 border-amber-700/50',
          ];
          const medals = ['1 МІСЦЕ', '2 МІСЦЕ', '3 МІСЦЕ'];

          return (
            <div
              key={player.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${podiumColors[idx] || 'from-slate-800 to-slate-900'} border p-5 shadow-xl space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-950/80 text-orange-400 border border-slate-800 uppercase">
                  {medals[idx]}
                </span>
                <span className="font-athletic text-lg font-bold text-slate-400">
                  #{player.number}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={team?.logoUrl}
                    alt={team?.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-white text-base tracking-wide truncate">
                    {player.name}
                  </h3>
                  <button
                    onClick={() => handleTeamClick(player.teamId)}
                    className="text-xs text-slate-400 hover:text-orange-400 transition-colors uppercase truncate block"
                  >
                    {team?.shortName}
                  </button>
                  <span className="text-[10px] text-slate-500">
                    {player.positionNameUk}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <span className="text-xs text-slate-400 uppercase font-semibold">
                  {categories.find((c) => c.id === category)?.label}:
                </span>
                <span className="font-athletic text-3xl font-extrabold text-orange-400">
                  {player.stats[category]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f141e]">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-12">№</th>
              <th className="py-3 px-4">ГРАВЕЦЬ</th>
              <th className="py-3 px-3">КОМАНДА</th>
              <th className="py-3 px-3 text-center">ПОЗИЦІЯ</th>
              <th className="py-3 px-3 text-center">ІГОР</th>
              <th className="py-3 px-4 text-right font-extrabold text-orange-400 uppercase">
                {categories.find((c) => c.id === category)?.label}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPlayers.map((player, index) => {
              const team = teams.find((t) => t.id === player.teamId);
              return (
                <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white tracking-wide flex items-center gap-2">
                      <span className="text-orange-400 font-athletic text-sm">#{player.number}</span>
                      <span>{player.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTeamClick(player.teamId)}
                      className="text-xs text-slate-300 hover:text-orange-400 transition-colors uppercase font-semibold flex items-center gap-1.5"
                    >
                      <img src={team?.logoUrl} alt="" className="w-4 h-4 object-contain" />
                      <span>{team?.shortName}</span>
                    </button>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-400 text-xs">
                    {player.positionNameUk}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {player.stats.games}
                  </td>
                  <td className="py-3 px-4 text-right font-athletic text-base sm:text-lg font-extrabold text-orange-400">
                    {player.stats[category]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { StandingsRow, StandingsOverride } from '../types';
import {
  Trophy,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Edit2,
  RotateCcw,
  Sliders,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';

interface StandingsTableProps {
  compact?: boolean;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ compact = false }) => {
  const {
    standings,
    setActiveTab,
    setSelectedTeamId,
    isAdmin,
    standingsMode,
    setStandingsMode,
    moveTeamInStandings,
    updateTeamStandingsOverride,
    resetStandingsOverrides,
    populateDemoResults,
    clearAllResults,
  } = useLeague();

  const [editingRow, setEditingRow] = useState<{ teamId: string; teamName: string; stats: StandingsOverride } | null>(null);

  const handleTeamClick = (teamId: string) => {
    setSelectedTeamId(teamId);
    setActiveTab('teams');
  };

  const isZeroState = standings.every((s) => s.played === 0);

  const handleSaveRowOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    updateTeamStandingsOverride(editingRow.teamId, editingRow.stats);
    setEditingRow(null);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
              ТУРНІРНА ТАБЛИЦЯ
            </h2>
            {standingsMode === 'manual' && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                РУЧНЕ НАЛАШТУВАННЯ
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Регулярний чемпіонат АБЛ Рівненщини • Сезон 2026–2027
          </p>
        </div>

        {/* Admin Toolbar: Mode switch, simulate, reorder */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setStandingsMode('auto')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  standingsMode === 'auto'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Автоматичний розрахунок за результатами зіграних матчів"
              >
                Авто-підрахунок
              </button>
              <button
                onClick={() => setStandingsMode('manual')}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  standingsMode === 'manual'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ручне переміщення та редагування показників команд"
              >
                Ручний режим
              </button>
            </div>

            {standingsMode === 'manual' && (
              <button
                onClick={() => {
                  if (confirm('Скинути ручний порядок та показники до авто-підрахунку?')) {
                    resetStandingsOverrides();
                  }
                }}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold flex items-center gap-1"
                title="Скинути всі ручні зміни"
              >
                <RotateCcw className="w-3 h-3 text-orange-400" />
                <span>Скинути до авто</span>
              </button>
            )}

            {isZeroState ? (
              <button
                onClick={populateDemoResults}
                className="px-2.5 py-1 bg-orange-600/30 hover:bg-orange-600 text-orange-300 hover:text-white font-bold rounded transition-colors"
                title="Заповнити результати 1-го туру для демонстрації формул"
              >
                + Демо 1 тур
              </button>
            ) : (
              <button
                onClick={clearAllResults}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded transition-colors"
                title="Скинути результати до початкового стану 0-0"
              >
                Скинути до 0-0
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Manual Instructions Alert */}
      {isAdmin && standingsMode === 'manual' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-2">
          <span>
            ℹ️ <strong>Ручний режим увімкнено:</strong> використовуйте стрілочки ▲ / ▼ біля кожної команди для зміни позиції в таблиці, або кнопку олівця для зміни показників (ігри, перемоги, бали).
          </span>
        </div>
      )}

      {/* Mobile Swipe Hint */}
      <div className="md:hidden flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
        <span>Турнірна таблиця (Сезон 2026–2027)</span>
        <span className="text-orange-400 font-semibold">← Проведіть для деталей →</span>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f141e] shadow-xl scrollbar-thin scrollbar-thumb-slate-700">
        <table className="w-full text-left border-collapse min-w-[560px] md:min-w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-3 sm:px-4 text-center w-16">№</th>
              <th className="py-3.5 px-3 sm:px-4">КОМАНДА</th>
              <th className="py-3.5 px-2 text-center" title="Зіграні матчі">І</th>
              <th className="py-3.5 px-2 text-center" title="Перемоги">В</th>
              <th className="py-3.5 px-2 text-center" title="Поразки">П</th>
              <th className="py-3.5 px-2 text-center hidden md:table-cell" title="Набрані очки">ОЗ</th>
              <th className="py-3.5 px-2 text-center hidden md:table-cell" title="Пропущені очки">ОП</th>
              <th className="py-3.5 px-3 text-center font-extrabold text-orange-400" title="Турнірні бали">БАЛИ</th>
              {!compact && (
                <th className="py-3.5 px-3 text-center hidden sm:table-cell" title="Форма: останні 5 матчів">ФОРМА</th>
              )}
              {isAdmin && standingsMode === 'manual' && (
                <th className="py-3.5 px-3 text-right">РУЧНЕ КЕРУВАННЯ</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
            {standings.map((row, index) => {
              const isFinalFourZone = row.rank <= 4;
              return (
                <tr
                  key={row.teamId}
                  className={`group transition-colors hover:bg-slate-800/60 ${
                    isFinalFourZone ? 'bg-orange-500/[0.02]' : ''
                  }`}
                >
                  {/* Rank & Reorder controls if Admin */}
                  <td className="py-3 px-2 sm:px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {isAdmin && standingsMode === 'manual' && (
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveTeamInStandings(row.teamId, 'up')}
                            className="p-1 rounded bg-slate-800 hover:bg-orange-600 disabled:opacity-20 text-white transition-colors"
                            title="Перемістити вище"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={index === standings.length - 1}
                            onClick={() => moveTeamInStandings(row.teamId, 'down')}
                            className="p-1 rounded bg-slate-800 hover:bg-orange-600 disabled:opacity-20 text-white transition-colors"
                            title="Перемістити нижче"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div
                        className={`inline-flex items-center justify-center w-6 h-6 rounded font-athletic text-base font-bold ${
                          row.rank === 1
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : row.rank <= 4
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                            : 'text-slate-400'
                        }`}
                      >
                        {row.rank}
                      </div>
                    </div>
                  </td>

                  {/* Team Logo & Name in strictly UPPERCASE */}
                  <td className="py-3 px-3 sm:px-4">
                    <button
                      onClick={() => handleTeamClick(row.teamId)}
                      className="flex items-center gap-2.5 sm:gap-3 text-left group-hover:text-orange-400 transition-colors"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-950 border border-slate-700/50 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={row.team.logoUrl}
                          alt={row.team.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-white group-hover:text-orange-400 tracking-wide uppercase transition-colors">
                          {row.team.name}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:block">
                          {row.team.city}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity hidden sm:block" />
                    </button>
                  </td>

                  {/* Games Played */}
                  <td className="py-3 px-2 text-center font-mono font-semibold text-slate-200">
                    {row.played}
                  </td>

                  {/* Wins */}
                  <td className="py-3 px-2 text-center font-mono font-semibold text-emerald-400">
                    {row.wins}
                  </td>

                  {/* Losses */}
                  <td className="py-3 px-2 text-center font-mono font-semibold text-rose-400">
                    {row.losses}
                  </td>

                  {/* Points Scored */}
                  <td className="py-3 px-2 text-center font-mono text-slate-300 hidden md:table-cell">
                    {row.pointsScored}
                  </td>

                  {/* Points Allowed */}
                  <td className="py-3 px-2 text-center font-mono text-slate-400 hidden md:table-cell">
                    {row.pointsAllowed}
                  </td>

                  {/* Total Tournament Points */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 font-athletic text-lg font-extrabold text-orange-400">
                      {row.points}
                    </span>
                  </td>

                  {/* Form */}
                  {!compact && (
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      {row.form.length === 0 ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {row.form.map((res, i) => (
                            <span
                              key={i}
                              title={res === 'W' ? 'Перемога' : 'Поразка'}
                              className={`w-5 h-5 rounded flex items-center justify-center font-athletic text-xs font-bold text-white shadow-sm ${
                                res === 'W' ? 'bg-emerald-600' : 'bg-rose-600'
                              }`}
                            >
                              {res === 'W' ? 'В' : 'П'}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Manual Edit Button */}
                  {isAdmin && standingsMode === 'manual' && (
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() =>
                          setEditingRow({
                            teamId: row.teamId,
                            teamName: row.team.name,
                            stats: {
                              played: row.played,
                              wins: row.wins,
                              losses: row.losses,
                              pointsScored: row.pointsScored,
                              pointsAllowed: row.pointsAllowed,
                              pointsDiff: row.pointsDiff,
                              points: row.points,
                            },
                          })
                        }
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-orange-600 text-slate-300 hover:text-white text-xs font-bold transition-colors inline-flex items-center gap-1"
                        title="Змінити статистику рядка вручну"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Змінити</span>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row Edit Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleSaveRowOverride}
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-athletic text-xl font-bold uppercase text-white">
                РУЧНЕ РЕДАГУВАННЯ: {editingRow.teamName}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold uppercase block mb-1">Зіграні (І)</label>
                <input
                  type="number"
                  value={editingRow.stats.played ?? 0}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      stats: { ...editingRow.stats, played: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase block mb-1">Перемоги (В)</label>
                <input
                  type="number"
                  value={editingRow.stats.wins ?? 0}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      stats: { ...editingRow.stats, wins: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-emerald-400 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase block mb-1">Поразки (П)</label>
                <input
                  type="number"
                  value={editingRow.stats.losses ?? 0}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      stats: { ...editingRow.stats, losses: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-rose-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold uppercase block mb-1">Набрані (ОЗ)</label>
                <input
                  type="number"
                  value={editingRow.stats.pointsScored ?? 0}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      stats: { ...editingRow.stats, pointsScored: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase block mb-1">Пропущені (ОП)</label>
                <input
                  type="number"
                  value={editingRow.stats.pointsAllowed ?? 0}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      stats: { ...editingRow.stats, pointsAllowed: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase block mb-1">БАЛИ</label>
                <input
                  type="number"
                  value={editingRow.stats.points ?? 0}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      stats: { ...editingRow.stats, points: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-orange-400 font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
              >
                Зберегти показники
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Footer & Rules Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-orange-500" />
            <span className="font-semibold text-slate-300">1–4 місця:</span>
            <span>Вихід до Фіналу чотирьох</span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <span className="w-2 h-2 rounded bg-emerald-500" />
            <span>В — Перемога (зелений)</span>
          </div>
          <div className="flex items-center gap-1.5 hidden md:flex">
            <span className="w-2 h-2 rounded bg-rose-500" />
            <span>П — Поразка (червоний)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Правила нарахування: Перемога = 2 бали • Поразка = 1 бал • Технічна поразка = 0 балів
        </div>
      </div>
    </div>
  );
};

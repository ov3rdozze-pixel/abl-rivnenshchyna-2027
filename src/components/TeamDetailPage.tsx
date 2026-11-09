import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import { Team, Player, Match } from '../types';
import { Trophy, ArrowLeft, MapPin, User, Shield, Calendar, Award, Phone, Mail, ChevronRight, Activity, Plus } from 'lucide-react';

interface TeamDetailPageProps {
  teamId: string;
  onBack: () => void;
}

export const TeamDetailPage: React.FC<TeamDetailPageProps> = ({ teamId, onBack }) => {
  const { teams, players, matches, standings, setActiveTab, setSelectedMatchId, isAdmin } = useLeague();
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'matches' | 'about'>('matches');

  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-400">Команду не знайдено.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold"
        >
          Повернутися до списку
        </button>
      </div>
    );
  }

  const teamStanding = standings.find((s) => s.teamId === team.id);
  const teamPlayers = players.filter((p) => p.teamId === team.id);
  const teamMatches = matches.filter(
    (m) => m.homeTeamId === team.id || m.awayTeamId === team.id
  );

  const completedMatches = teamMatches
    .filter((m) => m.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const upcomingMatches = teamMatches
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>НАЗАД ДО ВСІХ КОМАНД</span>
        </button>
      </div>

      {/* Team Header Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#101622] to-[#0b0e14] border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          
          {/* Big Original Logo */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-slate-950/80 border border-slate-700/80 p-3 flex items-center justify-center shrink-0 shadow-2xl">
            <img
              src={team.logoUrl}
              alt={team.name}
              className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Team Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Учасник АБЛ Рівненщини • Сезон 2026–2027</span>
            </div>

            <h1 className="font-athletic text-3xl sm:text-5xl font-extrabold text-white tracking-wide uppercase">
              {team.name}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{team.city || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</span>
              </span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-orange-500" />
                <span>Головний тренер: <strong className="text-white">{team.coach || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</strong></span>
              </span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span>Арена: <strong className="text-white">{team.homeArena || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</strong></span>
              </span>
            </div>

            {/* Quick Record Ribbon */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <span className="text-slate-400 font-medium">Місце в таблиці: </span>
                <strong className="text-orange-400 font-athletic text-base">
                  {teamStanding ? `#${teamStanding.rank}` : '—'}
                </strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <span className="text-slate-400 font-medium">Перемоги / Поразки: </span>
                <strong className="text-white font-mono">
                  {teamStanding ? `${teamStanding.wins} - ${teamStanding.losses}` : '0 - 0'}
                </strong>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs">
                <span className="text-slate-400 font-medium">Турнірні бали: </span>
                <strong className="text-orange-400 font-athletic text-base">
                  {teamStanding ? teamStanding.points : 0}
                </strong>
              </div>
              {teamStanding && teamStanding.form.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-lg text-xs">
                  <span className="text-slate-400 mr-1 font-medium">Форма:</span>
                  {teamStanding.form.map((res, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center text-white ${
                        res === 'W' ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {res === 'W' ? 'В' : 'П'}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Sub Tabs: Roster | Matches | About */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg tracking-wider uppercase transition-colors ${
            activeSubTab === 'roster'
              ? 'bg-orange-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          СКЛАД КОМАНДИ {teamPlayers.length > 0 ? `(${teamPlayers.length})` : ''}
        </button>
        <button
          onClick={() => setActiveSubTab('matches')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg tracking-wider uppercase transition-colors ${
            activeSubTab === 'matches'
              ? 'bg-orange-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          КАЛЕНДАР ТА МАТЧІ ({teamMatches.length})
        </button>
        <button
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg tracking-wider uppercase transition-colors ${
            activeSubTab === 'about'
              ? 'bg-orange-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          ПРО КЛУБ ТА ІСТОРІЯ
        </button>
      </div>

      {/* SUB-TAB 1: ROSTER */}
      {activeSubTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide">
              ЗАЯВКА КОМАНДИ НА СЕЗОН 2026–2027
            </h3>
            {isAdmin && (
              <span className="text-xs text-orange-400 font-medium">
                * Керуйте гравцями через вкладку «Адмін-панель»
              </span>
            )}
          </div>

          {teamPlayers.length === 0 ? (
            <div className="p-10 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Офіційний заявковий лист та склад гравців команди на сезон 2026–2027 наразі формується оргкомітетом АБЛ.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f141e]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3 text-center w-12">№</th>
                    <th className="py-3 px-4">ГРАВЕЦЬ</th>
                    <th className="py-3 px-3 text-center">ПОЗИЦІЯ</th>
                    <th className="py-3 px-3 text-center hidden sm:table-cell">ЗРІСТ</th>
                    <th className="py-3 px-3 text-center hidden sm:table-cell">РІК</th>
                    <th className="py-3 px-3 text-center">ОЧКИ</th>
                    <th className="py-3 px-3 text-center hidden md:table-cell">ПІДБ.</th>
                    <th className="py-3 px-3 text-center hidden md:table-cell">ПЕРЕД.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                  {teamPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <span className="font-athletic text-base font-extrabold text-orange-400">
                          #{player.number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white tracking-wide">
                          {player.name}
                        </div>
                        <div className="text-[11px] text-slate-400 sm:hidden">
                          {player.positionNameUk}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300">
                          {player.positionNameUk || player.position}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300 hidden sm:table-cell">
                        {player.heightCm ? `${player.heightCm} см` : '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400 hidden sm:table-cell">
                        {player.birthYear || '—'}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-white">
                        {player.stats.points}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300 hidden md:table-cell">
                        {player.stats.rebounds}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300 hidden md:table-cell">
                        {player.stats.assists}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MATCHES */}
      {activeSubTab === 'matches' && (
        <div className="space-y-6">
          {/* Upcoming */}
          <div>
            <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide mb-3">
              НАЙБЛИЖЧІ МАТЧІ КОМАНДИ
            </h3>
            {upcomingMatches.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-900 p-4 rounded-xl border border-slate-800">
                Запланованих поєдинків на найближчий час немає.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcomingMatches.map((m) => {
                  const home = teams.find((t) => t.id === m.homeTeamId);
                  const away = teams.find((t) => t.id === m.awayTeamId);
                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 mb-3">
                        <span className="font-semibold text-orange-400">ТУР {m.round}</span>
                        <span>{m.date} • {m.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <img src={home?.logoUrl} alt="" className="w-7 h-7 object-contain shrink-0" />
                          <span className={`text-xs font-extrabold truncate ${home?.id === team.id ? 'text-orange-400' : 'text-white'}`}>
                            {home?.name}
                          </span>
                        </div>
                        <span className="font-athletic text-sm font-bold text-slate-400 px-2">VS</span>
                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                          <span className={`text-xs font-extrabold truncate text-right ${away?.id === team.id ? 'text-orange-400' : 'text-white'}`}>
                            {away?.name}
                          </span>
                          <img src={away?.logoUrl} alt="" className="w-7 h-7 object-contain shrink-0" />
                        </div>
                      </div>
                      <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{m.venue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Played */}
          <div>
            <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide mb-3">
              ЗІГРАНІ МАТЧІ
            </h3>
            {completedMatches.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-900 p-4 rounded-xl border border-slate-800">
                Зіграних матчів у цьому сезоні ще немає.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {completedMatches.map((m) => {
                  const home = teams.find((t) => t.id === m.homeTeamId);
                  const away = teams.find((t) => t.id === m.awayTeamId);
                  const isHome = m.homeTeamId === team.id;
                  const teamScore = isHome ? m.homeScore! : m.awayScore!;
                  const oppScore = isHome ? m.awayScore! : m.homeScore!;
                  const isWin = teamScore > oppScore;

                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800 mb-3">
                        <span className="font-semibold text-slate-400">ТУР {m.round}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {isWin ? 'ПЕРЕМОГА' : 'ПОРАЗКА'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[40%]">{home?.shortName}</span>
                        <span className="font-athletic text-xl font-extrabold text-orange-400 px-3">
                          {m.homeScore} : {m.awayScore}
                        </span>
                        <span className="text-xs font-bold text-white truncate max-w-[40%] text-right">{away?.shortName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ABOUT & HISTORY */}
      {activeSubTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                <span>ОПИС КОМАНДИ</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {team.description || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" />
                <span>ІСТОРІЯ ТА ДОСЯГНЕННЯ</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {team.history || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="font-athletic text-lg font-bold uppercase text-white tracking-wide">
                КЛУБНІ ВІДОМОСТІ
              </h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Місто:</span>
                  <strong className="text-white">{team.city || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Домашній майданчик:</span>
                  <strong className="text-white">{team.homeArena || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Головний тренер:</span>
                  <strong className="text-white">{team.coach || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</strong>
                </div>
                {team.contactEmail && (
                  <div>
                    <span className="text-slate-400 block text-xs">Контактний email:</span>
                    <a href={`mailto:${team.contactEmail}`} className="text-orange-400 hover:underline">
                      {team.contactEmail}
                    </a>
                  </div>
                )}
                {team.contactPhone && (
                  <div>
                    <span className="text-slate-400 block text-xs">Телефон:</span>
                    <span className="text-slate-200">{team.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

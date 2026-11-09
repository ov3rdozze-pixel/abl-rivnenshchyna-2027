import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { TeamDetailPage } from './TeamDetailPage';
import { Shield, MapPin, User, ChevronRight, Trophy } from 'lucide-react';

export const TeamsSection: React.FC = () => {
  const { teams, standings, selectedTeamId, setSelectedTeamId } = useLeague();

  if (selectedTeamId) {
    return (
      <TeamDetailPage
        teamId={selectedTeamId}
        onBack={() => setSelectedTeamId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
              КОМАНДИ СЕЗОНУ 2026–2027
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Офіційний реєстр дев'яти клубів Аматорської баскетбольної ліги Рівненщини
          </p>
        </div>
        <div className="text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg">
          9 ЗАТВЕРДЖЕНИХ УЧАСНИКІВ
        </div>
      </div>

      {/* Grid of 9 Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {teams.map((team, index) => {
          const standing = standings.find((s) => s.teamId === team.id);

          return (
            <div
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-[#111622] to-[#0c1017] border border-slate-800/90 hover:border-orange-500/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500 opacity-80 group-hover:opacity-100 transition-opacity"
              />

              <div className="space-y-4">
                {/* Header: Logo + Name */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950/80 border border-slate-700/60 p-2 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                    <img
                      src={team.logoUrl}
                      alt={team.name}
                      className="w-full h-full object-contain filter drop-shadow"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-extrabold text-orange-400 tracking-wider uppercase mb-1">
                      КОМАНДА #{index + 1}
                    </div>
                    <h3 className="font-extrabold text-white text-base sm:text-lg uppercase tracking-wide group-hover:text-orange-400 transition-colors leading-tight">
                      {team.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">{team.city || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}</span>
                    </div>
                  </div>
                </div>

                {/* Info Snippets */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Тренер:</span>
                    <strong className="text-white truncate max-w-[60%]">
                      {team.coach || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Арена:</span>
                    <span className="text-slate-300 truncate max-w-[60%]">
                      {team.homeArena || 'ІНФОРМАЦІЯ НЕЗАБАРОМ З’ЯВИТЬСЯ'}
                    </span>
                  </div>
                </div>

                {/* Quick Standing Stats */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-center text-xs">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">МІСЦЕ</div>
                    <div className="font-athletic text-base font-extrabold text-orange-400">
                      {standing ? `#${standing.rank}` : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">МАТЧІ</div>
                    <div className="font-mono text-sm font-semibold text-slate-200">
                      {standing ? `${standing.wins}-${standing.losses}` : '0-0'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">БАЛИ</div>
                    <div className="font-athletic text-base font-extrabold text-white">
                      {standing ? standing.points : 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400 group-hover:text-orange-300">
                <span>ПЕРЕГЛЯНУТИ СТОРІНКУ КОМАНДИ</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

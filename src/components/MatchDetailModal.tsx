import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { Match, Team } from '../types';
import { X, Calendar, MapPin, Clock, Trophy } from 'lucide-react';

interface MatchDetailModalProps {
  matchId: string;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ matchId, onClose }) => {
  const { matches, teams } = useLeague();
  const match = matches.find((m) => m.id === matchId);

  if (!match) return null;

  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);

  const isCompleted = match.status === 'completed';
  const q = match.quarters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-[#101522] to-[#0b0e14] border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            АБЛ РІВНЕНЩИНИ • ТУР {match.round}
          </div>
          <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
            ПРОТОКОЛ МАТЧУ
          </h2>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>{match.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span>{match.time}</span>
            </span>
          </div>
        </div>

        {/* Score Board */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
          
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-1 flex items-center justify-center">
              <img
                src={homeTeam?.logoUrl}
                alt={homeTeam?.name}
                className="w-full h-full object-contain filter drop-shadow"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide">
              {homeTeam?.name}
            </div>
            <div className="text-[11px] text-slate-400">ГОСПОДАРІ</div>
          </div>

          {/* Central Score / VS */}
          <div className="text-center px-4">
            {isCompleted ? (
              <div>
                <div className="font-athletic text-4xl sm:text-6xl font-extrabold text-orange-400 tracking-wider">
                  {match.homeScore} : {match.awayScore}
                </div>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                  ФІНАЛЬНИЙ РАХУНОК
                </span>
              </div>
            ) : (
              <div>
                <div className="font-athletic text-3xl sm:text-4xl font-extrabold text-slate-400 tracking-wider">
                  VS
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 uppercase">
                  ЗАПЛАНОВАНО
                </span>
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-1 flex items-center justify-center">
              <img
                src={awayTeam?.logoUrl}
                alt={awayTeam?.name}
                className="w-full h-full object-contain filter drop-shadow"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide">
              {awayTeam?.name}
            </div>
            <div className="text-[11px] text-slate-400">ГОСТІ</div>
          </div>

        </div>

        {/* Quarters breakdown if completed */}
        {isCompleted && q && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
              РАХУНОК ЗА ЧВЕРТЯМИ
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2 px-3 text-left">Команда</th>
                    <th className="py-2 px-2">1-а</th>
                    <th className="py-2 px-2">2-а</th>
                    <th className="py-2 px-2">3-я</th>
                    <th className="py-2 px-2">4-а</th>
                    {q.otHome !== undefined && <th className="py-2 px-2">ОТ</th>}
                    <th className="py-2 px-3 font-bold text-orange-400">ВСЬОГО</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 text-left font-sans font-bold text-white truncate max-w-[120px]">
                      {homeTeam?.shortName}
                    </td>
                    <td className="py-2.5 px-2">{q.q1Home}</td>
                    <td className="py-2.5 px-2">{q.q2Home}</td>
                    <td className="py-2.5 px-2">{q.q3Home}</td>
                    <td className="py-2.5 px-2">{q.q4Home}</td>
                    {q.otHome !== undefined && <td className="py-2.5 px-2">{q.otHome}</td>}
                    <td className="py-2.5 px-3 font-bold text-orange-400">{match.homeScore}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-sans font-bold text-white truncate max-w-[120px]">
                      {awayTeam?.shortName}
                    </td>
                    <td className="py-2.5 px-2">{q.q1Away}</td>
                    <td className="py-2.5 px-2">{q.q2Away}</td>
                    <td className="py-2.5 px-2">{q.q3Away}</td>
                    <td className="py-2.5 px-2">{q.q4Away}</td>
                    {q.otAway !== undefined && <td className="py-2.5 px-2">{q.otAway}</td>}
                    <td className="py-2.5 px-3 font-bold text-orange-400">{match.awayScore}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Venue Information */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
          <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
          <span>Місце проведення: <strong>{match.venue}</strong></span>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { NewsDetailPage } from './NewsDetailPage';
import { Newspaper, Calendar, User, ChevronRight, PlusCircle } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, selectedNewsId, setSelectedNewsId, setActiveTab, isAdmin } = useLeague();

  if (selectedNewsId) {
    return (
      <NewsDetailPage
        newsId={selectedNewsId}
        onBack={() => setSelectedNewsId(null)}
      />
    );
  }

  const featured = news.find((n) => n.featured) || news[0];
  const remaining = news.filter((n) => n.id !== featured?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-orange-500" />
            <h2 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-wide">
              НОВИНИ ТА ПРЕС-РЕЛІЗИ АБЛ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Офіційні повідомлення, підсумки турів та новини команд сезону 2026–2027
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>ОПУБЛІКУВАТИ НОВИНУ</span>
          </button>
        )}
      </div>

      {/* Featured Big News Banner */}
      {featured && (
        <div
          onClick={() => setSelectedNewsId(featured.id)}
          className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-[#121927] border border-slate-800 hover:border-orange-500/60 transition-all p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6"
        >
          <div className="w-full md:w-1/3 h-52 sm:h-64 rounded-xl bg-slate-950 p-4 flex items-center justify-center border border-slate-800 shrink-0">
            <img
              src={featured.imageUrl || '/logos/abl_league.png'}
              alt={featured.title}
              className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-orange-500/20 text-orange-400 text-xs font-bold uppercase">
                {featured.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{featured.publishedAt}</span>
              </span>
            </div>

            <h3 className="font-athletic text-2xl sm:text-3xl font-extrabold uppercase text-white group-hover:text-orange-400 transition-colors leading-tight">
              {featured.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed">
              {featured.excerpt}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-bold text-orange-400 group-hover:text-orange-300">
              <span>ЧИТАТИ ПОВНІСТЮ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      )}

      {/* Other Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {remaining.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedNewsId(item.id)}
            className="group cursor-pointer rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/50 p-5 shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-xl bg-slate-950 p-3 flex items-center justify-center border border-slate-800/80">
                <img
                  src={item.imageUrl || '/logos/abl_league.png'}
                  alt={item.title}
                  className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-400 font-semibold text-[10px] uppercase">
                  {item.category}
                </span>
                <span>{item.publishedAt}</span>
              </div>

              <h4 className="font-athletic text-lg font-bold uppercase text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                {item.title}
              </h4>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {item.excerpt}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Читати статтю</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

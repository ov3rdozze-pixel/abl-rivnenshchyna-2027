import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';

interface NewsDetailPageProps {
  newsId: string;
  onBack: () => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ newsId, onBack }) => {
  const { news } = useLeague();
  const article = news.find((n) => n.id === newsId);

  if (!article) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-400">Новину не знайдено.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold"
        >
          Повернутися до новин
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>НАЗАД ДО ВСІХ НОВИН</span>
      </button>

      {/* Article Header Card */}
      <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="relative h-64 sm:h-96 w-full bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-8 overflow-hidden">
          <div className="absolute inset-0 bg-radial from-orange-500/10 to-transparent pointer-events-none" />
          <img
            src={article.imageUrl || '/logos/abl_league.png'}
            alt={article.title}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow">
              {article.category}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 pb-4 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{article.publishedAt}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-orange-500" />
              <span>{article.author}</span>
            </span>
          </div>

          <h1 className="font-athletic text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white tracking-wide leading-tight">
            {article.title}
          </h1>

          <div className="p-4 rounded-xl bg-slate-950/80 border-l-2 border-orange-500 text-slate-300 italic text-base sm:text-lg leading-relaxed">
            {article.excerpt}
          </div>

          {/* Article Body */}
          <div className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4 pt-2">
            {article.content}
          </div>
        </div>
      </div>
    </article>
  );
};

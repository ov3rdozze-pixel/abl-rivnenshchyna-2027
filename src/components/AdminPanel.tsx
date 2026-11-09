import React, { useState } from 'react';
import { useLeague } from '../context/LeagueContext';
import {
  Team,
  Player,
  Match,
  NewsItem,
  FinalFourConfig,
  RoundMvpAward,
  StandingsOverride,
} from '../types';
import { StorageService } from '../services/storage';
import {
  Settings,
  Trophy,
  Shield,
  Users,
  Calendar,
  Newspaper,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Download,
  Upload,
  AlertTriangle,
  Flame,
  Save,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Award,
  X,
  Clock,
  MapPin,
  Star,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    db,
    standings,
    teams,
    players,
    matches,
    news,
    finalFour,
    mvpAwards,
    mvpLeaderboard,
    standingsMode,
    setStandingsMode,
    moveTeamInStandings,
    updateTeamStandingsOverride,
    resetStandingsOverrides,
    updateTeam,
    addPlayer,
    updatePlayer,
    deletePlayer,
    addMatch,
    updateMatch,
    deleteMatch,
    addNews,
    updateNews,
    deleteNews,
    updateFinalFour,
    addMvpAward,
    updateMvpAward,
    deleteMvpAward,
    populateDemoResults,
    clearAllResults,
    resetDatabase,
    refreshData,
  } = useLeague();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'standings' | 'teams' | 'players' | 'matches' | 'mvp' | 'news' | 'finalfour' | 'database'
  >('overview');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // ----------------------------------------------------
  // STANDINGS ROW EDIT STATE
  // ----------------------------------------------------
  const [editingStandingsTeamId, setEditingStandingsTeamId] = useState<string | null>(null);
  const [standingsOverrideForm, setStandingsOverrideForm] = useState<StandingsOverride>({});

  // ----------------------------------------------------
  // TEAMS EDIT STATE
  // ----------------------------------------------------
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    updateTeam(editingTeam);
    setEditingTeam(null);
    showNotification(`Дані команди ${editingTeam.name} збережено!`);
  };

  // ----------------------------------------------------
  // PLAYERS EDIT STATE (ROSTER & TRANSFERS)
  // ----------------------------------------------------
  const [playerTeamFilter, setPlayerTeamFilter] = useState<string>('kozyri');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    teamId: 'kozyri',
    name: '',
    number: 10,
    position: 'SG',
    positionNameUk: 'Атакуючий захисник',
    heightCm: 190,
    birthYear: 2000,
    stats: { games: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 },
  });

  const handleSaveNewPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.teamId) return;
    const playerToAdd: Player = {
      id: `p_${Date.now()}`,
      teamId: newPlayer.teamId,
      name: newPlayer.name,
      number: Number(newPlayer.number) || 0,
      position: (newPlayer.position as any) || 'SG',
      positionNameUk: newPlayer.positionNameUk || 'Захисник',
      heightCm: Number(newPlayer.heightCm) || undefined,
      birthYear: Number(newPlayer.birthYear) || undefined,
      stats: newPlayer.stats || { games: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 },
    };
    addPlayer(playerToAdd);
    setIsAddingPlayer(false);
    showNotification('Гравця успішно додано!');
  };

  const handleSaveEditPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer) return;
    updatePlayer(editingPlayer);
    setEditingPlayer(null);
    showNotification('Дані гравця оновлено!');
  };

  // ----------------------------------------------------
  // MATCHES EDIT STATE (UPCOMING & SCORES)
  // ----------------------------------------------------
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [editingUpcomingMatch, setEditingUpcomingMatch] = useState<Match | null>(null);
  const [editingScoreMatch, setEditingScoreMatch] = useState<Match | null>(null);

  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    round: 1,
    homeTeamId: 'kozyri',
    awayTeamId: 'shpaniv',
    date: '2026-11-20',
    time: '14:00',
    venue: 'Спорткомплекс НУВГП, м. Рівне',
    status: 'upcoming',
  });

  const handleSaveNewMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.homeTeamId || !newMatch.awayTeamId) return;
    if (newMatch.homeTeamId === newMatch.awayTeamId) {
      alert('Господар і гість не можуть бути однією командою');
      return;
    }
    const matchToAdd: Match = {
      id: `m_${Date.now()}`,
      round: Number(newMatch.round) || 1,
      homeTeamId: newMatch.homeTeamId,
      awayTeamId: newMatch.awayTeamId,
      date: newMatch.date || '2026-11-20',
      time: newMatch.time || '14:00',
      venue: newMatch.venue || 'Спорткомплекс НУВГП, м. Рівне',
      status: 'upcoming',
    };
    addMatch(matchToAdd);
    setIsAddingMatch(false);
    showNotification('Новий матч успішно заплановано!');
  };

  const handleSaveUpcomingMatchEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpcomingMatch) return;
    updateMatch(editingUpcomingMatch);
    setEditingUpcomingMatch(null);
    showNotification('Параметри матчу оновлено!');
  };

  const handleSaveScoreMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScoreMatch) return;
    updateMatch(editingScoreMatch);
    setEditingScoreMatch(null);
    showNotification('Результат поєдинку успішно внесено, таблиця автоматично перерахована!');
  };

  // ----------------------------------------------------
  // TOP MVP ТУРУ EDIT STATE
  // ----------------------------------------------------
  const [isAddingMvp, setIsAddingMvp] = useState(false);
  const [editingMvp, setEditingMvp] = useState<RoundMvpAward | null>(null);
  const [newMvp, setNewMvp] = useState<Partial<RoundMvpAward>>({
    round: 1,
    playerName: '',
    teamId: 'kozyri',
    matchInfo: '',
    points: 20,
    rebounds: 8,
    assists: 5,
    steals: 2,
    blocks: 1,
    efficiency: 25,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSaveNewMvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMvp.playerName || !newMvp.teamId) {
      alert('Будь ласка, вкажіть ім\'я гравця та команду');
      return;
    }
    const award: RoundMvpAward = {
      id: `mvp_${Date.now()}`,
      round: Number(newMvp.round) || 1,
      playerName: newMvp.playerName,
      teamId: newMvp.teamId,
      matchInfo: newMvp.matchInfo || '',
      points: Number(newMvp.points) || 0,
      rebounds: Number(newMvp.rebounds) || 0,
      assists: Number(newMvp.assists) || 0,
      steals: Number(newMvp.steals) || 0,
      blocks: Number(newMvp.blocks) || 0,
      efficiency: Number(newMvp.efficiency) || 0,
      description: newMvp.description || '',
      date: newMvp.date || new Date().toISOString().split('T')[0],
    };
    addMvpAward(award);
    setIsAddingMvp(false);
    setNewMvp({
      round: (Number(newMvp.round) || 1) + 1,
      playerName: '',
      teamId: 'kozyri',
      matchInfo: '',
      points: 20,
      rebounds: 8,
      assists: 5,
      steals: 2,
      blocks: 1,
      efficiency: 25,
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    showNotification('Нагороду MVP туру успішно додано!');
  };

  const handleSaveEditMvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMvp) return;
    updateMvpAward(editingMvp);
    setEditingMvp(null);
    showNotification('Дані MVP туру оновлено!');
  };

  // ----------------------------------------------------
  // NEWS EDIT STATE
  // ----------------------------------------------------
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newNews, setNewNews] = useState<Partial<NewsItem>>({
    title: '',
    category: 'Офіційно',
    excerpt: '',
    content: '',
    imageUrl: '/logos/abl_league.png',
    author: 'Оргкомітет АБЛ',
  });

  const handleSaveNewNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.title || !newNews.content) return;
    const itemToAdd: NewsItem = {
      id: `news_${Date.now()}`,
      title: newNews.title,
      slug: `news-${Date.now()}`,
      category: newNews.category || 'Новина',
      excerpt: newNews.excerpt || newNews.title,
      content: newNews.content,
      imageUrl: newNews.imageUrl || '/logos/abl_league.png',
      publishedAt: new Date().toISOString().split('T')[0],
      author: newNews.author || 'Пресслужба АБЛ',
      featured: false,
    };
    addNews(itemToAdd);
    setIsAddingNews(false);
    showNotification('Новину успішно опубліковано!');
  };

  const handleSaveEditNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    updateNews(editingNews);
    setEditingNews(null);
    showNotification('Новину оновлено!');
  };

  // ----------------------------------------------------
  // FINAL FOUR MANAGEMENT
  // ----------------------------------------------------
  const [ffConfig, setFfConfig] = useState<FinalFourConfig>(() => ({ ...finalFour }));

  const handleAutoPickTop4 = () => {
    const top4 = standings.slice(0, 4).map((s) => s.teamId);
    if (top4.length < 4) {
      alert('Недостатньо команд у турнірній таблиці.');
      return;
    }
    const updated: FinalFourConfig = {
      ...ffConfig,
      qualifiedTeamIds: top4,
      semiFinal1: {
        ...ffConfig.semiFinal1,
        homeTeamId: top4[0],
        awayTeamId: top4[3],
      },
      semiFinal2: {
        ...ffConfig.semiFinal2,
        homeTeamId: top4[1],
        awayTeamId: top4[2],
      },
    };
    setFfConfig(updated);
    updateFinalFour(updated);
    showNotification('Топ-4 команди успішно підтягнуто з турнірної таблиці!');
  };

  const handleSaveFinalFour = () => {
    updateFinalFour(ffConfig);
    showNotification('Налаштування Фіналу чотирьох збережено!');
  };

  // ----------------------------------------------------
  // DATABASE BACKUP & RESTORE
  // ----------------------------------------------------
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(StorageService.exportDatabaseJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `abl_rivne_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Резервну копію успішно завантажено!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = StorageService.importDatabaseJson(content);
      if (res.success) {
        refreshData();
        showNotification('Базу даних успішно відновлено з файлу!');
      } else {
        alert(res.error || 'Помилка імпорту');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {saveMessage && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-500 animate-spin-slow" />
            <h2 className="font-athletic text-3xl font-extrabold uppercase text-white tracking-wide">
              ПАНЕЛЬ КЕРУВАННЯ АБЛ
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Повне автономне керування командами, складами, матчами, MVP туру та турнірною таблицею
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={populateDemoResults}
            className="px-3 py-1.5 bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg text-xs font-bold uppercase transition-colors"
          >
            + Демо 1 тур
          </button>
          <button
            onClick={clearAllResults}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase transition-colors"
          >
            Скинути до 0-0
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'overview', label: 'ОГЛЯД', icon: Trophy },
          { id: 'standings', label: 'ТУРНІРНА ТАБЛИЦЯ (РУЧНЕ)', icon: Trophy },
          { id: 'teams', label: 'КОМАНДИ (9)', icon: Shield },
          { id: 'players', label: 'СКЛАД ТА ГРАВЦІ', icon: Users },
          { id: 'matches', label: 'МАТЧІ ТА РОЗКЛАД', icon: Calendar },
          { id: 'mvp', label: 'TOP MVP ТУРУ', icon: Award },
          { id: 'news', label: 'НОВИНИ', icon: Newspaper },
          { id: 'finalfour', label: 'ФІНАЛ ЧОТИРЬОХ', icon: Flame },
          { id: 'database', label: 'БАЗА ДАНИХ ТА БЕКАП', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. OVERVIEW */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="font-athletic text-3xl font-extrabold text-white">9</div>
              <div className="text-xs font-semibold text-slate-400 uppercase">КОМАНД У ЛІЗІ</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="font-athletic text-3xl font-extrabold text-orange-400">{players.length}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase">ГРАВЦІВ У БАЗІ</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="font-athletic text-3xl font-extrabold text-white">{matches.length}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase">МАТЧІВ У КАЛЕНДАРІ</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="font-athletic text-3xl font-extrabold text-amber-400">{mvpAwards.length}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase">НАГОРОД MVP ТУРУ</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4">
            <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500" />
              <span>МОЖЛИВОСТІ АДМІНІСТРАТОРА</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">1. Турнірна таблиця (Переміщення):</strong>
                <p className="text-slate-400">
                  Ви можете перемикати між автоматичним підрахунком за матчами та ручним режимом зі стрілочками ▲ / ▼ для довільного переміщення команд та ручного коригування очок.
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">2. Склад команд та трансфери:</strong>
                <p className="text-slate-400">
                  Додавайте, редагуйте номери, позиції, зріст та переводьте гравців між командами ліги у вкладці «Склад та гравці».
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">3. Календар та найближчі матчі:</strong>
                <p className="text-slate-400">
                  Редагуйте дати, час, арени майбутніх поєдинків та вносьте фінальні рахунки з деталізацією за чвертями.
                </p>
              </div>
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-white block font-bold">4. Вкладка Top MVP туру:</strong>
                <p className="text-slate-400">
                  Призначайте найцінніших гравців за кожен тур чемпіонату, система автоматично формує рейтинг за кількістю нагород MVP.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. STANDINGS MANUAL REORDER & OVERRIDES */}
      {/* ========================================================= */}
      {activeTab === 'standings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide">
                  РЕЖИМ ТУРНІРНОЇ ТАБЛИЦІ
                </h3>
                <p className="text-xs text-slate-400">
                  Оберіть: автоматичний підрахунок формулами за зіграними матчами або ручне переміщення та зміна показників.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setStandingsMode('auto');
                    showNotification('Увімкнено автоматичний підрахунок за результатами матчів');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    standingsMode === 'auto'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Авто-підрахунок (Матчі)
                </button>
                <button
                  onClick={() => {
                    setStandingsMode('manual');
                    showNotification('Увімкнено ручне налаштування та переміщення');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    standingsMode === 'manual'
                      ? 'bg-orange-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Ручний режим (Переміщення)
                </button>
              </div>
            </div>

            {standingsMode === 'manual' && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-amber-300">
                <span>
                  Ви можете переміщувати команди вгору/вниз кнопками ▲ / ▼ або редагувати кількість ігор, перемог та балів вручну.
                </span>
                <button
                  onClick={() => {
                    resetStandingsOverrides();
                    showNotification('Скинуто до автоматичного розрахунку!');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold"
                >
                  Скинути до авто
                </button>
              </div>
            )}
          </div>

          {/* Standings Reorder Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f141e]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-3 text-center w-24">МІСЦЕ / РУХ</th>
                  <th className="py-3 px-4">КОМАНДА</th>
                  <th className="py-3 px-3 text-center">ІГРИ (І)</th>
                  <th className="py-3 px-3 text-center">В</th>
                  <th className="py-3 px-3 text-center">П</th>
                  <th className="py-3 px-3 text-center">ОЗ</th>
                  <th className="py-3 px-3 text-center">ОП</th>
                  <th className="py-3 px-3 text-center text-orange-400 font-bold">БАЛИ</th>
                  <th className="py-3 px-3 text-right">ДІЇ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {standings.map((row, idx) => (
                  <tr key={row.teamId} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="font-athletic text-base font-bold text-slate-300 w-5">
                          #{row.rank}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveTeamInStandings(row.teamId, 'up')}
                            className="p-1 rounded bg-slate-800 hover:bg-orange-600 disabled:opacity-20 text-white transition-colors"
                            title="Перемістити вище"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === standings.length - 1}
                            onClick={() => moveTeamInStandings(row.teamId, 'down')}
                            className="p-1 rounded bg-slate-800 hover:bg-orange-600 disabled:opacity-20 text-white transition-colors"
                            title="Перемістити нижче"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img src={row.team.logoUrl} alt="" className="w-6 h-6 object-contain" />
                        <span className="font-extrabold text-white uppercase">{row.team.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{row.played}</td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">{row.wins}</td>
                    <td className="py-3 px-3 text-center font-mono text-rose-400 font-bold">{row.losses}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">{row.pointsScored}</td>
                    <td className="py-3 px-3 text-center font-mono text-slate-400">{row.pointsAllowed}</td>
                    <td className="py-3 px-3 text-center font-athletic text-base font-extrabold text-orange-400">
                      {row.points}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setEditingStandingsTeamId(row.teamId);
                          setStandingsOverrideForm({
                            played: row.played,
                            wins: row.wins,
                            losses: row.losses,
                            pointsScored: row.pointsScored,
                            pointsAllowed: row.pointsAllowed,
                            pointsDiff: row.pointsDiff,
                            points: row.points,
                          });
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-orange-600 text-white text-xs font-bold rounded"
                      >
                        Редагувати показники
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standings Override Modal */}
          {editingStandingsTeamId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTeamStandingsOverride(editingStandingsTeamId, standingsOverrideForm);
                  setEditingStandingsTeamId(null);
                  showNotification('Показники рядка таблиці збережено!');
                }}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  РУЧНЕ КОРИГУВАННЯ РЯДКА ТАБЛИЦІ
                </h3>
                <p className="text-xs text-orange-400 font-semibold uppercase">
                  {teams.find((t) => t.id === editingStandingsTeamId)?.name}
                </p>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Ігри (І)</label>
                    <input
                      type="number"
                      value={standingsOverrideForm.played ?? 0}
                      onChange={(e) => setStandingsOverrideForm({ ...standingsOverrideForm, played: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Перемоги (В)</label>
                    <input
                      type="number"
                      value={standingsOverrideForm.wins ?? 0}
                      onChange={(e) => setStandingsOverrideForm({ ...standingsOverrideForm, wins: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-emerald-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Поразки (П)</label>
                    <input
                      type="number"
                      value={standingsOverrideForm.losses ?? 0}
                      onChange={(e) => setStandingsOverrideForm({ ...standingsOverrideForm, losses: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-rose-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400">Набрані (ОЗ)</label>
                    <input
                      type="number"
                      value={standingsOverrideForm.pointsScored ?? 0}
                      onChange={(e) => setStandingsOverrideForm({ ...standingsOverrideForm, pointsScored: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Пропущені (ОП)</label>
                    <input
                      type="number"
                      value={standingsOverrideForm.pointsAllowed ?? 0}
                      onChange={(e) => setStandingsOverrideForm({ ...standingsOverrideForm, pointsAllowed: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">БАЛИ</label>
                    <input
                      type="number"
                      value={standingsOverrideForm.points ?? 0}
                      onChange={(e) => setStandingsOverrideForm({ ...standingsOverrideForm, points: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-orange-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingStandingsTeamId(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Застосувати
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. TEAMS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-athletic text-xl font-bold uppercase text-white">
              СПИСОК 9 ЗАТВЕРДЖЕНИХ КОМАНД
            </h3>
            <span className="text-xs text-slate-400">
              * За правилами ліги назви відображаються виключно ВЕЛИКИМИ ЛІТЕРАМИ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800">
                    <img src={team.logoUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-white text-sm uppercase truncate">
                      {team.name}
                    </h4>
                    <span className="text-xs text-slate-400 block truncate">{team.city}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 space-y-1 pt-2 border-t border-slate-800/80">
                  <div>Тренер: <strong>{team.coach || 'Не вказано'}</strong></div>
                  <div className="truncate">Арена: {team.homeArena || 'Не вказано'}</div>
                  {team.contactPhone && <div>Тел: {team.contactPhone}</div>}
                </div>

                <button
                  onClick={() => setEditingTeam({ ...team })}
                  className="w-full mt-2 py-2 bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-200 text-xs font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Редагувати інформацію клубу</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Team Modal */}
          {editingTeam && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveTeam}
                className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  РЕДАГУВАННЯ КОМАНДИ: {editingTeam.name}
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Офіційна назва команди (ВЕЛИКИМИ ЛІТЕРАМИ)</label>
                  <input
                    type="text"
                    value={editingTeam.name}
                    onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Місто</label>
                    <input
                      type="text"
                      value={editingTeam.city}
                      onChange={(e) => setEditingTeam({ ...editingTeam, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Головний тренер</label>
                    <input
                      type="text"
                      value={editingTeam.coach}
                      onChange={(e) => setEditingTeam({ ...editingTeam, coach: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Домашній майданчик / Арена</label>
                  <input
                    type="text"
                    value={editingTeam.homeArena}
                    onChange={(e) => setEditingTeam({ ...editingTeam, homeArena: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Email</label>
                    <input
                      type="email"
                      value={editingTeam.contactEmail || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, contactEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Телефон</label>
                    <input
                      type="text"
                      value={editingTeam.contactPhone || ''}
                      onChange={(e) => setEditingTeam({ ...editingTeam, contactPhone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Опис команди</label>
                  <textarea
                    rows={3}
                    value={editingTeam.description}
                    onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Історія клубу</label>
                  <textarea
                    rows={3}
                    value={editingTeam.history}
                    onChange={(e) => setEditingTeam({ ...editingTeam, history: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingTeam(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Зберегти зміни
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PLAYERS ROSTER & TRANSFERS */}
      {/* ========================================================= */}
      {activeTab === 'players' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Команда:</span>
              <select
                value={playerTeamFilter}
                onChange={(e) => setPlayerTeamFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs rounded-lg px-3 py-2 font-bold"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setNewPlayer((prev) => ({ ...prev, teamId: playerTeamFilter }));
                setIsAddingPlayer(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Додати нового гравця</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f141e]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-3 text-center">№</th>
                  <th className="py-3 px-4">ПІБ ГРАВЦЯ</th>
                  <th className="py-3 px-3">ПОЗИЦІЯ</th>
                  <th className="py-3 px-3 text-center">ЗРІСТ</th>
                  <th className="py-3 px-3 text-center">РІК</th>
                  <th className="py-3 px-3 text-center">ОЧКИ</th>
                  <th className="py-3 px-3 text-center">ПІДБ.</th>
                  <th className="py-3 px-3 text-center">ПЕРЕД.</th>
                  <th className="py-3 px-3 text-right">ДІЇ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {players.filter((p) => p.teamId === playerTeamFilter).length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                      Склад цієї команди наразі порожній (склади відмінено). Ви можете додати офіційних гравців кнопкою «Додати нового гравця».
                    </td>
                  </tr>
                ) : (
                  players.filter((p) => p.teamId === playerTeamFilter).map((player) => (
                    <tr key={player.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 text-center font-athletic text-base font-bold text-orange-400">
                        #{player.number}
                      </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {player.name}
                    </td>
                    <td className="py-3 px-3 text-slate-300 text-xs">
                      {player.positionNameUk}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {player.heightCm ? `${player.heightCm} см` : '—'}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-400 font-mono">
                      {player.birthYear || '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-white font-mono">
                      {player.stats.points}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300 font-mono">
                      {player.stats.rebounds}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300 font-mono">
                      {player.stats.assists}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingPlayer({ ...player })}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                          title="Редагувати / Перевести в іншу команду"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Видалити гравця ${player.name}?`)) {
                              deletePlayer(player.id);
                              showNotification('Гравця видалено');
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))
              }
              </tbody>
            </table>
          </div>

          {/* Add Player Modal */}
          {isAddingPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveNewPlayer}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  ДОДАТИ ГРАВЦЯ
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">ПІБ гравця</label>
                  <input
                    type="text"
                    value={newPlayer.name || ''}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold"
                    placeholder="Ім'я та Прізвище"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Команда (Клуб)</label>
                  <select
                    value={newPlayer.teamId}
                    onChange={(e) => setNewPlayer({ ...newPlayer, teamId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Ігровий номер (#)</label>
                    <input
                      type="number"
                      value={newPlayer.number || ''}
                      onChange={(e) => setNewPlayer({ ...newPlayer, number: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Позиція</label>
                    <select
                      value={newPlayer.positionNameUk}
                      onChange={(e) => setNewPlayer({ ...newPlayer, positionNameUk: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    >
                      <option value="Розігруючий захисник">Розігруючий захисник</option>
                      <option value="Атакуючий захисник">Атакуючий захисник</option>
                      <option value="Легкий форвард">Легкий форвард</option>
                      <option value="Важкий форвард">Важкий форвард</option>
                      <option value="Центровий">Центровий</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingPlayer(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Зберегти
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit Player & Transfer Modal */}
          {editingPlayer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveEditPlayer}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  РЕДАГУВАННЯ ГРАВЦЯ ТА ТРАНСФЕР
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">ПІБ гравця</label>
                  <input
                    type="text"
                    value={editingPlayer.name}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Команда (Зміна команди / трансфер)</label>
                  <select
                    value={editingPlayer.teamId}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, teamId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-orange-400 font-bold"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Номер (#)</label>
                    <input
                      type="number"
                      value={editingPlayer.number}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, number: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Позиція</label>
                    <input
                      type="text"
                      value={editingPlayer.positionNameUk}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, positionNameUk: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-[10px] text-slate-400">ОЧКИ</label>
                    <input
                      type="number"
                      value={editingPlayer.stats.points}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, stats: { ...editingPlayer.stats, points: parseInt(e.target.value) || 0 } })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">ПІДБИРАННЯ</label>
                    <input
                      type="number"
                      value={editingPlayer.stats.rebounds}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, stats: { ...editingPlayer.stats, rebounds: parseInt(e.target.value) || 0 } })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">ПЕРЕДАЧІ</label>
                    <input
                      type="number"
                      value={editingPlayer.stats.assists}
                      onChange={(e) => setEditingPlayer({ ...editingPlayer, stats: { ...editingPlayer.stats, assists: parseInt(e.target.value) || 0 } })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingPlayer(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Зберегти
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MATCHES MANAGEMENT (UPCOMING & SCORES) */}
      {/* ========================================================= */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-athletic text-xl font-bold uppercase text-white">
              КАЛЕНДАР ТА РЕЗУЛЬТАТИ МАТЧІВ
            </h3>
            <button
              onClick={() => setIsAddingMatch(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Запланувати новий матч</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => {
              const home = teams.find((t) => t.id === m.homeTeamId);
              const away = teams.find((t) => t.id === m.awayTeamId);

              return (
                <div
                  key={m.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold text-orange-400">ТУР {m.round}</span>
                    <span className="text-slate-400">{m.date} • {m.time}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <img src={home?.logoUrl} alt="" className="w-6 h-6 object-contain shrink-0" />
                      <span className="font-extrabold text-white text-xs truncate uppercase">{home?.name}</span>
                    </div>

                    <div className="px-3 text-center">
                      {m.status === 'completed' ? (
                        <span className="font-athletic text-xl font-extrabold text-orange-400">
                          {m.homeScore} : {m.awayScore}
                        </span>
                      ) : (
                        <span className="font-athletic text-sm font-bold text-slate-500">VS</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                      <span className="font-extrabold text-white text-xs truncate uppercase text-right">{away?.name}</span>
                      <img src={away?.logoUrl} alt="" className="w-6 h-6 object-contain shrink-0" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[50%]">{m.venue}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingUpcomingMatch({ ...m })}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded text-[11px]"
                        title="Змінити дату, час, арену, команди"
                      >
                        Розклад
                      </button>
                      <button
                        onClick={() => {
                          setEditingScoreMatch({
                            ...m,
                            homeScore: m.homeScore ?? 80,
                            awayScore: m.awayScore ?? 75,
                            quarters: m.quarters || { q1Home: 20, q1Away: 18, q2Home: 20, q2Away: 19, q3Home: 20, q3Away: 18, q4Home: 20, q4Away: 20 },
                            status: 'completed',
                          });
                        }}
                        className="px-2.5 py-1 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded text-[11px]"
                      >
                        {m.status === 'completed' ? 'Змінити рахунок' : 'Внести рахунок'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Видалити цей матч із календаря?')) {
                            deleteMatch(m.id);
                            showNotification('Матч видалено');
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit Match Schedule Modal */}
          {editingUpcomingMatch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveUpcomingMatchEdit}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  РЕДАГУВАННЯ РОЗКЛАДУ МАТЧУ
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Тур</label>
                  <input
                    type="number"
                    value={editingUpcomingMatch.round}
                    onChange={(e) => setEditingUpcomingMatch({ ...editingUpcomingMatch, round: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase">Господарі</label>
                    <select
                      value={editingUpcomingMatch.homeTeamId}
                      onChange={(e) => setEditingUpcomingMatch({ ...editingUpcomingMatch, homeTeamId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    >
                      {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase">Гості</label>
                    <select
                      value={editingUpcomingMatch.awayTeamId}
                      onChange={(e) => setEditingUpcomingMatch({ ...editingUpcomingMatch, awayTeamId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    >
                      {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase">Дата</label>
                    <input
                      type="date"
                      value={editingUpcomingMatch.date}
                      onChange={(e) => setEditingUpcomingMatch({ ...editingUpcomingMatch, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 uppercase">Час</label>
                    <input
                      type="time"
                      value={editingUpcomingMatch.time}
                      onChange={(e) => setEditingUpcomingMatch({ ...editingUpcomingMatch, time: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase">Арена / Місце</label>
                  <input
                    type="text"
                    value={editingUpcomingMatch.venue}
                    onChange={(e) => setEditingUpcomingMatch({ ...editingUpcomingMatch, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingUpcomingMatch(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold"
                  >
                    Зберегти розклад
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Enter Match Score Modal */}
          {editingScoreMatch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveScoreMatch}
                className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  ВНЕСЕННЯ РЕЗУЛЬТАТУ МАТЧУ
                </h3>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-bold text-white text-sm">
                  {teams.find((t) => t.id === editingScoreMatch.homeTeamId)?.name} VS {teams.find((t) => t.id === editingScoreMatch.awayTeamId)?.name}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Очки господарів</label>
                    <input
                      type="number"
                      value={editingScoreMatch.homeScore ?? ''}
                      onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, homeScore: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-athletic font-bold text-orange-400"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Очки гостей</label>
                    <input
                      type="number"
                      value={editingScoreMatch.awayScore ?? ''}
                      onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, awayScore: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-athletic font-bold text-orange-400"
                      required
                    />
                  </div>
                </div>

                {/* Quarters (Q1, Q2, Q3, Q4) */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 uppercase">Рахунок за чвертями (Q1, Q2, Q3, Q4)</label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">1-а (Госп/Гість)</span>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="20"
                          value={editingScoreMatch.quarters?.q1Home ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q1Home: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                        <input
                          type="number"
                          placeholder="18"
                          value={editingScoreMatch.quarters?.q1Away ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q1Away: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">2-а (Госп/Гість)</span>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="22"
                          value={editingScoreMatch.quarters?.q2Home ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q2Home: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                        <input
                          type="number"
                          placeholder="19"
                          value={editingScoreMatch.quarters?.q2Away ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q2Away: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">3-я (Госп/Гість)</span>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="19"
                          value={editingScoreMatch.quarters?.q3Home ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q3Home: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                        <input
                          type="number"
                          placeholder="17"
                          value={editingScoreMatch.quarters?.q3Away ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q3Away: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">4-а (Госп/Гість)</span>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="21"
                          value={editingScoreMatch.quarters?.q4Home ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q4Home: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                        <input
                          type="number"
                          placeholder="19"
                          value={editingScoreMatch.quarters?.q4Away ?? ''}
                          onChange={(e) => setEditingScoreMatch({ ...editingScoreMatch, quarters: { ...(editingScoreMatch.quarters as any), q4Away: parseInt(e.target.value) || 0 } })}
                          className="w-1/2 bg-slate-950 border border-slate-700 rounded p-1 text-center text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingScoreMatch(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Зберегти результат
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add Match Modal */}
          {isAddingMatch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveNewMatch}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  ЗАПЛАНУВАТИ МАТЧ
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Номер туру</label>
                  <input
                    type="number"
                    value={newMatch.round || 1}
                    onChange={(e) => setNewMatch({ ...newMatch, round: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Господарі</label>
                    <select
                      value={newMatch.homeTeamId}
                      onChange={(e) => setNewMatch({ ...newMatch, homeTeamId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Гості</label>
                    <select
                      value={newMatch.awayTeamId}
                      onChange={(e) => setNewMatch({ ...newMatch, awayTeamId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Дата</label>
                    <input
                      type="date"
                      value={newMatch.date}
                      onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Час</label>
                    <input
                      type="time"
                      value={newMatch.time}
                      onChange={(e) => setNewMatch({ ...newMatch, time: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Місце проведення</label>
                  <input
                    type="text"
                    value={newMatch.venue}
                    onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingMatch(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Запланувати
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. TOP MVP ТУРУ MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'mvp' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-athletic text-xl font-bold uppercase text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                <span>НАГОРОДИ «TOP MVP ТУРУ»</span>
              </h3>
              <p className="text-xs text-slate-400">
                Додавайте та змінюйте визнання MVP за кожен тур. Рейтинг формується автоматично.
              </p>
            </div>

            <button
              onClick={() => setIsAddingMvp(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Призначити MVP туру</span>
            </button>
          </div>

          {/* Table of MVP awards */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0f141e]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-3 text-center">ТУР</th>
                  <th className="py-3 px-4">ГРАВЕЦЬ</th>
                  <th className="py-3 px-3">КОМАНДА</th>
                  <th className="py-3 px-3 text-center">ОЧКИ</th>
                  <th className="py-3 px-3 text-center">ПІДБ.</th>
                  <th className="py-3 px-3 text-center">ПЕРЕД.</th>
                  <th className="py-3 px-3 text-center">РЕЙТИНГ</th>
                  <th className="py-3 px-4">МАТЧ / ОПИС</th>
                  <th className="py-3 px-3 text-right">ДІЇ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mvpAwards.map((award) => {
                  const team = teams.find((t) => t.id === award.teamId);
                  return (
                    <tr key={award.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 text-center font-athletic text-base font-bold text-orange-400">
                        Тур {award.round}
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        {award.playerName}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-xs uppercase font-semibold">
                        {team?.name}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-orange-400">
                        {award.points}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {award.rebounds}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {award.assists}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">
                        +{award.efficiency || 0}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400 truncate max-w-xs">
                        {award.matchInfo || award.description || '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingMvp({ ...award })}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Редагувати"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Видалити нагороду MVP ${award.round}-го туру для ${award.playerName}?`)) {
                                deleteMvpAward(award.id);
                                showNotification('Нагороду видалено');
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                            title="Видалити"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add MVP Award Modal */}
          {isAddingMvp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveNewMvp}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  ПРИЗНАЧИТИ MVP ТУРУ
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Номер туру</label>
                    <input
                      type="number"
                      value={newMvp.round || 1}
                      onChange={(e) => setNewMvp({ ...newMvp, round: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Команда гравця</label>
                    <select
                      value={newMvp.teamId}
                      onChange={(e) => setNewMvp({ ...newMvp, teamId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">ПІБ гравця</label>
                  <input
                    type="text"
                    value={newMvp.playerName || ''}
                    onChange={(e) => setNewMvp({ ...newMvp, playerName: e.target.value })}
                    placeholder="Наприклад: Владислав Захарчук"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Матч туру</label>
                  <input
                    type="text"
                    value={newMvp.matchInfo || ''}
                    onChange={(e) => setNewMvp({ ...newMvp, matchInfo: e.target.value })}
                    placeholder="Наприклад: БК «КОЗИРІ» — БК «ШПАНІВ» (78:71)"
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>

                {/* Stats in that match */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400">Очки</label>
                    <input
                      type="number"
                      value={newMvp.points || 0}
                      onChange={(e) => setNewMvp({ ...newMvp, points: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Підбирання</label>
                    <input
                      type="number"
                      value={newMvp.rebounds || 0}
                      onChange={(e) => setNewMvp({ ...newMvp, rebounds: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Передачі</label>
                    <input
                      type="number"
                      value={newMvp.assists || 0}
                      onChange={(e) => setNewMvp({ ...newMvp, assists: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Рейтинг</label>
                    <input
                      type="number"
                      value={newMvp.efficiency || 0}
                      onChange={(e) => setNewMvp({ ...newMvp, efficiency: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Опис виступу</label>
                  <textarea
                    rows={3}
                    value={newMvp.description || ''}
                    onChange={(e) => setNewMvp({ ...newMvp, description: e.target.value })}
                    placeholder="Завдяки чому гравець здобув нагороду MVP..."
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingMvp(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold"
                  >
                    Призначити
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit MVP Modal */}
          {editingMvp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveEditMvp}
                className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  РЕДАГУВАННЯ MVP ТУРУ
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Номер туру</label>
                    <input
                      type="number"
                      value={editingMvp.round}
                      onChange={(e) => setEditingMvp({ ...editingMvp, round: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 uppercase">Команда гравця</label>
                    <select
                      value={editingMvp.teamId}
                      onChange={(e) => setEditingMvp({ ...editingMvp, teamId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-xs"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">ПІБ гравця</label>
                  <input
                    type="text"
                    value={editingMvp.playerName}
                    onChange={(e) => setEditingMvp({ ...editingMvp, playerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400">Очки</label>
                    <input
                      type="number"
                      value={editingMvp.points}
                      onChange={(e) => setEditingMvp({ ...editingMvp, points: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Підбирання</label>
                    <input
                      type="number"
                      value={editingMvp.rebounds}
                      onChange={(e) => setEditingMvp({ ...editingMvp, rebounds: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Передачі</label>
                    <input
                      type="number"
                      value={editingMvp.assists}
                      onChange={(e) => setEditingMvp({ ...editingMvp, assists: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Рейтинг</label>
                    <input
                      type="number"
                      value={editingMvp.efficiency || 0}
                      onChange={(e) => setEditingMvp({ ...editingMvp, efficiency: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Опис виступу</label>
                  <textarea
                    rows={3}
                    value={editingMvp.description || ''}
                    onChange={(e) => setEditingMvp({ ...editingMvp, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingMvp(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-bold"
                  >
                    Зберегти зміни
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. NEWS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-athletic text-xl font-bold uppercase text-white">
              НОВИНИ ТА ПУБЛІКАЦІЇ
            </h3>
            <button
              onClick={() => setIsAddingNews(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Опублікувати статтю</span>
            </button>
          </div>

          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-800">
                    <img src={item.imageUrl || '/logos/abl_league.png'} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                    <span className="text-xs text-slate-400">{item.publishedAt} • {item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditingNews({ ...item })}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Видалити цю новину?')) {
                        deleteNews(item.id);
                        showNotification('Новину видалено');
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add News Modal */}
          {isAddingNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveNewNews}
                className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  НОВА ПУБЛІКАЦІЯ
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Заголовок новини</label>
                  <input
                    type="text"
                    value={newNews.title || ''}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Повний текст статті</label>
                  <textarea
                    rows={6}
                    value={newNews.content || ''}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingNews(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Опублікувати
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit News Modal */}
          {editingNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
              <form
                onSubmit={handleSaveEditNews}
                className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <h3 className="font-athletic text-2xl font-bold uppercase text-white">
                  РЕДАГУВАННЯ СТАТТІ
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Заголовок</label>
                  <input
                    type="text"
                    value={editingNews.title}
                    onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 uppercase">Повний текст статті</label>
                  <textarea
                    rows={8}
                    value={editingNews.content}
                    onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingNews(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold"
                  >
                    Зберегти зміни
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. FINAL FOUR MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'finalfour' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-athletic text-2xl font-bold uppercase text-white tracking-wide flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span>СТАТУС РОЗДІЛУ «ФІНАЛ ЧОТИРЬОХ»</span>
                </h3>
                <p className="text-xs text-slate-400">
                  За замовчуванням вимкнений. Ви можете активувати його після завершення регулярного чемпіонату.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold uppercase ${ffConfig.isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {ffConfig.isActive ? 'АКТИВОВАНО' : 'НЕАКТИВНИЙ (СКОРО)'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...ffConfig, isActive: !ffConfig.isActive };
                    setFfConfig(updated);
                    updateFinalFour(updated);
                    showNotification(updated.isActive ? 'Фінал чотирьох активовано!' : 'Фінал чотирьох деактивовано!');
                  }}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${ffConfig.isActive ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${ffConfig.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleAutoPickTop4}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Автоматично обрати 4 найкращі команди за таблицею</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Semi Final 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-athletic text-lg font-bold uppercase text-orange-400">ПІВФІНАЛ 1</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400">Команда 1</label>
                  <select
                    value={ffConfig.semiFinal1.homeTeamId || ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal1: { ...ffConfig.semiFinal1, homeTeamId: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                  >
                    <option value="">Оберіть команду</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Команда 2</label>
                  <select
                    value={ffConfig.semiFinal1.awayTeamId || ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal1: { ...ffConfig.semiFinal1, awayTeamId: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                  >
                    <option value="">Оберіть команду</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400">Рахунок 1</label>
                  <input
                    type="number"
                    value={ffConfig.semiFinal1.homeScore ?? ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal1: { ...ffConfig.semiFinal1, homeScore: parseInt(e.target.value) || undefined } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Рахунок 2</label>
                  <input
                    type="number"
                    value={ffConfig.semiFinal1.awayScore ?? ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal1: { ...ffConfig.semiFinal1, awayScore: parseInt(e.target.value) || undefined } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Semi Final 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-athletic text-lg font-bold uppercase text-orange-400">ПІВФІНАЛ 2</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400">Команда 1</label>
                  <select
                    value={ffConfig.semiFinal2.homeTeamId || ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal2: { ...ffConfig.semiFinal2, homeTeamId: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                  >
                    <option value="">Оберіть команду</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Команда 2</label>
                  <select
                    value={ffConfig.semiFinal2.awayTeamId || ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal2: { ...ffConfig.semiFinal2, awayTeamId: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                  >
                    <option value="">Оберіть команду</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400">Рахунок 1</label>
                  <input
                    type="number"
                    value={ffConfig.semiFinal2.homeScore ?? ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal2: { ...ffConfig.semiFinal2, homeScore: parseInt(e.target.value) || undefined } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Рахунок 2</label>
                  <input
                    type="number"
                    value={ffConfig.semiFinal2.awayScore ?? ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, semiFinal2: { ...ffConfig.semiFinal2, awayScore: parseInt(e.target.value) || undefined } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Grand Final */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/50 space-y-3">
              <h4 className="font-athletic text-lg font-bold uppercase text-amber-400">ГРАНД ФІНАЛ</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400">Фіналіст 1</label>
                  <select
                    value={ffConfig.finalMatch.homeTeamId || ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, finalMatch: { ...ffConfig.finalMatch, homeTeamId: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                  >
                    <option value="">Оберіть команду</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400">Фіналіст 2</label>
                  <select
                    value={ffConfig.finalMatch.awayTeamId || ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, finalMatch: { ...ffConfig.finalMatch, awayTeamId: e.target.value } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white"
                  >
                    <option value="">Оберіть команду</option>
                    {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-slate-400">Рахунок 1</label>
                  <input
                    type="number"
                    value={ffConfig.finalMatch.homeScore ?? ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, finalMatch: { ...ffConfig.finalMatch, homeScore: parseInt(e.target.value) || undefined } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Рахунок 2</label>
                  <input
                    type="number"
                    value={ffConfig.finalMatch.awayScore ?? ''}
                    onChange={(e) => setFfConfig({ ...ffConfig, finalMatch: { ...ffConfig.finalMatch, awayScore: parseInt(e.target.value) || undefined } })}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Champion Selector */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/50 space-y-3">
              <h4 className="font-athletic text-lg font-bold uppercase text-amber-400">ЧЕМПІОН ТА MVP</h4>
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-bold uppercase">Чемпіон АБЛ</label>
                <select
                  value={ffConfig.championTeamId || ''}
                  onChange={(e) => setFfConfig({ ...ffConfig, championTeamId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-sm text-amber-400 font-bold"
                >
                  <option value="">Ще не визначено</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-bold uppercase">MVP турніру</label>
                <input
                  type="text"
                  placeholder="ПІБ найціннішого гравця"
                  value={ffConfig.mvpPlayerName || ''}
                  onChange={(e) => setFfConfig({ ...ffConfig, mvpPlayerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleSaveFinalFour}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Зберегти налаштування Фіналу чотирьох</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. DATABASE & BACKUP */}
      {/* ========================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f141e] border border-slate-800 space-y-4">
            <h3 className="font-athletic text-xl font-bold uppercase text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-500" />
              <span>РЕЗЕРВНЕ КОПІЮВАННЯ ТА ВІДНОВЛЕННЯ БАЗИ ДАНИХ</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ви можете зберегти повну копію сезону (усі 9 команд, заявки гравців, результати матчів, протоколи, новини та нагороди MVP) 
              у вигляді файлу JSON або завантажити його для відновлення на будь-якому пристрої.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Експорт бази даних у JSON</span>
              </button>

              <label className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors border border-slate-700">
                <Upload className="w-4 h-4 text-orange-400" />
                <span>Імпорт бази даних з JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('УВАГА: Скинути всю базу даних до початкового стану сезону 2026–2027 (0-0 результати)?')) {
                    resetDatabase();
                    showNotification('Базу даних скинуто до початкового стану сезону!');
                  }
                }}
                className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-rose-500/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Скинути все до початку сезону</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  LeagueDatabase,
  StandingsRow,
  Team,
  Match,
  Player,
  NewsItem,
  FinalFourConfig,
  RoundMvpAward,
  MvpPlayerLeaderboard,
  StandingsOverride,
} from '../types';
import { StorageService } from '../services/storage';

interface LeagueContextType {
  db: LeagueDatabase;
  standings: StandingsRow[];
  teams: Team[];
  matches: Match[];
  players: Player[];
  news: NewsItem[];
  finalFour: FinalFourConfig;
  mvpAwards: RoundMvpAward[];
  mvpLeaderboard: MvpPlayerLeaderboard[];
  isAdmin: boolean;
  activeTab: string;
  selectedTeamId: string | null;
  selectedNewsId: string | null;
  selectedMatchId: string | null;
  standingsMode: 'auto' | 'manual';
  donationCard: string;
  setActiveTab: (tab: string) => void;
  setSelectedTeamId: (id: string | null) => void;
  setSelectedNewsId: (id: string | null) => void;
  setSelectedMatchId: (id: string | null) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  refreshData: () => void;
  updateTeam: (team: Team) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (playerId: string) => void;
  addMatch: (match: Match) => void;
  updateMatch: (match: Match) => void;
  deleteMatch: (matchId: string) => void;
  addNews: (news: NewsItem) => void;
  updateNews: (news: NewsItem) => void;
  deleteNews: (newsId: string) => void;
  updateFinalFour: (config: FinalFourConfig) => void;
  addMvpAward: (award: RoundMvpAward) => void;
  updateMvpAward: (award: RoundMvpAward) => void;
  deleteMvpAward: (awardId: string) => void;
  setStandingsMode: (mode: 'auto' | 'manual') => void;
  moveTeamInStandings: (teamId: string, direction: 'up' | 'down') => void;
  updateTeamStandingsOverride: (teamId: string, override: StandingsOverride) => void;
  resetStandingsOverrides: () => void;
  populateDemoResults: () => void;
  clearAllResults: () => void;
  resetDatabase: () => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const LeagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<LeagueDatabase>(() => StorageService.getDatabase());
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ABL_ADMIN_AUTH') === 'true';
    }
    return false;
  });

  const refreshData = () => {
    setDb(StorageService.getDatabase());
  };

  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const standings = useMemo(() => StorageService.calculateStandings(db), [db]);
  const mvpLeaderboard = useMemo(() => StorageService.getMvpLeaderboard(db), [db]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loginAdmin = (password: string): boolean => {
    if (password === 'Igorok24' || password === 'igorok24') {
      setIsAdmin(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ABL_ADMIN_AUTH', 'true');
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ABL_ADMIN_AUTH');
    }
  };

  const updateTeam = (team: Team) => StorageService.updateTeam(team);
  const addPlayer = (player: Player) => StorageService.addPlayer(player);
  const updatePlayer = (player: Player) => StorageService.updatePlayer(player);
  const deletePlayer = (playerId: string) => StorageService.deletePlayer(playerId);
  const addMatch = (match: Match) => StorageService.addMatch(match);
  const updateMatch = (match: Match) => StorageService.updateMatch(match);
  const deleteMatch = (matchId: string) => StorageService.deleteMatch(matchId);
  const addNews = (news: NewsItem) => StorageService.addNews(news);
  const updateNews = (news: NewsItem) => StorageService.updateNews(news);
  const deleteNews = (newsId: string) => StorageService.deleteNews(newsId);
  const updateFinalFour = (config: FinalFourConfig) => StorageService.updateFinalFour(config);

  const addMvpAward = (award: RoundMvpAward) => StorageService.addMvpAward(award);
  const updateMvpAward = (award: RoundMvpAward) => StorageService.updateMvpAward(award);
  const deleteMvpAward = (awardId: string) => StorageService.deleteMvpAward(awardId);

  const setStandingsMode = (mode: 'auto' | 'manual') => StorageService.setStandingsMode(mode);
  const moveTeamInStandings = (teamId: string, direction: 'up' | 'down') =>
    StorageService.moveTeamInStandings(teamId, direction);
  const updateTeamStandingsOverride = (teamId: string, override: StandingsOverride) =>
    StorageService.updateTeamStandingsOverride(teamId, override);
  const resetStandingsOverrides = () => StorageService.resetStandingsOverrides();

  const populateDemoResults = () => StorageService.populateDemoResults();
  const clearAllResults = () => StorageService.clearAllResults();
  const resetDatabase = () => StorageService.resetToInitial();

  return (
    <LeagueContext.Provider
      value={{
        db,
        standings,
        teams: db.teams,
        matches: db.matches,
        players: db.players,
        news: db.news,
        finalFour: db.finalFour,
        mvpAwards: db.mvpAwards || [],
        mvpLeaderboard,
        isAdmin,
        activeTab,
        selectedTeamId,
        selectedNewsId,
        selectedMatchId,
        standingsMode: db.settings?.standingsMode || 'auto',
        donationCard: db.settings?.donationCard || '4400005541086127',
        setActiveTab,
        setSelectedTeamId,
        setSelectedNewsId,
        setSelectedMatchId,
        loginAdmin,
        logoutAdmin,
        refreshData,
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
        setStandingsMode,
        moveTeamInStandings,
        updateTeamStandingsOverride,
        resetStandingsOverrides,
        populateDemoResults,
        clearAllResults,
        resetDatabase,
      }}
    >
      {children}
    </LeagueContext.Provider>
  );
};

export const useLeague = (): LeagueContextType => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
};

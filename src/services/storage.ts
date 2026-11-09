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
import { INITIAL_DATABASE } from '../data/initialData';

const DB_KEY = 'ABL_RIVNE_DB_2026_2027_V2';

export class StorageService {
  private static listeners: Set<() => void> = new Set();

  public static subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error notifying listener', err);
      }
    });
  }

  public static getDatabase(): LeagueDatabase {
    if (typeof window === 'undefined') {
      return INITIAL_DATABASE;
    }

    try {
      const stored = localStorage.getItem(DB_KEY);
      if (!stored) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATABASE));
        return INITIAL_DATABASE;
      }
      const parsed = JSON.parse(stored) as LeagueDatabase;
      
      // Ensure all 9 teams exist
      if (!parsed.teams || parsed.teams.length < 9) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATABASE));
        return INITIAL_DATABASE;
      }

      // Rosters canceled by user request
      parsed.players = [];

      // Migrations for new fields
      let needsSave = false;
      if (!parsed.mvpAwards) {
        parsed.mvpAwards = [];
        needsSave = true;
      }
      if (!parsed.settings) {
        parsed.settings = INITIAL_DATABASE.settings;
        needsSave = true;
      }
      if (!parsed.settings.standingsMode) {
        parsed.settings.standingsMode = 'auto';
        needsSave = true;
      }
      if (!parsed.settings.donationCard) {
        parsed.settings.donationCard = '4400005541086127';
        needsSave = true;
      }

      if (needsSave) {
        localStorage.setItem(DB_KEY, JSON.stringify(parsed));
      }

      return parsed;
    } catch (err) {
      console.error('Failed to parse database from localStorage', err);
      return INITIAL_DATABASE;
    }
  }

  public static saveDatabase(db: LeagueDatabase): void {
    if (typeof window === 'undefined') return;
    try {
      db.lastUpdated = new Date().toISOString();
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      this.notify();
    } catch (err) {
      console.error('Failed to save database to localStorage', err);
    }
  }

  public static resetToInitial(): LeagueDatabase {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATABASE));
      this.notify();
    }
    return INITIAL_DATABASE;
  }

  public static exportDatabaseJson(): string {
    const db = this.getDatabase();
    return JSON.stringify(db, null, 2);
  }

  public static importDatabaseJson(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString) as LeagueDatabase;
      if (!parsed.teams || !Array.isArray(parsed.teams) || parsed.teams.length === 0) {
        return { success: false, error: 'Некоректний формат файлу: відсутній список команд.' };
      }
      if (!parsed.mvpAwards) parsed.mvpAwards = [];
      if (!parsed.settings) parsed.settings = INITIAL_DATABASE.settings;
      this.saveDatabase(parsed);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      return { success: false, error: `Помилка парсингу: ${message}` };
    }
  }

  // Calculate standings (either auto from matches or manual with overrides & custom order)
  public static calculateStandings(db?: LeagueDatabase): StandingsRow[] {
    const database = db || this.getDatabase();
    const { teams, matches, settings } = database;
    const winPts = settings?.winPoints ?? 2;
    const lossPts = settings?.lossPoints ?? 1;
    const isManual = settings?.standingsMode === 'manual';
    const manualOrder = settings?.manualOrder || [];
    const overrides = settings?.standingsOverrides || {};

    // Initialize base stats map
    const statsMap = new Map<string, {
      played: number;
      wins: number;
      losses: number;
      pointsScored: number;
      pointsAllowed: number;
      matchesList: { date: string; result: 'W' | 'L' }[];
    }>();

    teams.forEach((t) => {
      statsMap.set(t.id, {
        played: 0,
        wins: 0,
        losses: 0,
        pointsScored: 0,
        pointsAllowed: 0,
        matchesList: [],
      });
    });

    // Calculate from completed matches
    const completedMatches = matches
      .filter((m) => m.status === 'completed' && m.homeScore !== undefined && m.awayScore !== undefined)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    completedMatches.forEach((m) => {
      const homeStats = statsMap.get(m.homeTeamId);
      const awayStats = statsMap.get(m.awayTeamId);
      const hScore = m.homeScore ?? 0;
      const aScore = m.awayScore ?? 0;

      if (homeStats) {
        homeStats.played += 1;
        homeStats.pointsScored += hScore;
        homeStats.pointsAllowed += aScore;
        if (hScore > aScore) {
          homeStats.wins += 1;
          homeStats.matchesList.push({ date: m.date, result: 'W' });
        } else {
          homeStats.losses += 1;
          homeStats.matchesList.push({ date: m.date, result: 'L' });
        }
      }

      if (awayStats) {
        awayStats.played += 1;
        awayStats.pointsScored += aScore;
        awayStats.pointsAllowed += hScore;
        if (aScore > hScore) {
          awayStats.wins += 1;
          awayStats.matchesList.push({ date: m.date, result: 'W' });
        } else {
          awayStats.losses += 1;
          awayStats.matchesList.push({ date: m.date, result: 'L' });
        }
      }
    });

    const rows: StandingsRow[] = teams.map((team) => {
      const stat = statsMap.get(team.id) || {
        played: 0,
        wins: 0,
        losses: 0,
        pointsScored: 0,
        pointsAllowed: 0,
        matchesList: [],
      };

      let played = stat.played;
      let wins = stat.wins;
      let losses = stat.losses;
      let pointsScored = stat.pointsScored;
      let pointsAllowed = stat.pointsAllowed;
      let pointsDiff = pointsScored - pointsAllowed;
      let points = played > 0 ? wins * winPts + losses * lossPts : 0;
      const form = stat.matchesList.slice(-5).map((x) => x.result);

      // Apply manual override if present and mode is manual
      if (isManual && overrides[team.id]) {
        const o = overrides[team.id];
        if (o.played !== undefined) played = o.played;
        if (o.wins !== undefined) wins = o.wins;
        if (o.losses !== undefined) losses = o.losses;
        if (o.pointsScored !== undefined) pointsScored = o.pointsScored;
        if (o.pointsAllowed !== undefined) pointsAllowed = o.pointsAllowed;
        if (o.pointsDiff !== undefined) pointsDiff = o.pointsDiff;
        else pointsDiff = pointsScored - pointsAllowed;
        if (o.points !== undefined) points = o.points;
      }

      return {
        rank: 1,
        teamId: team.id,
        team,
        played,
        wins,
        losses,
        pointsScored,
        pointsAllowed,
        pointsDiff,
        points,
        form,
      };
    });

    // Sorting
    if (isManual && manualOrder.length === teams.length) {
      // Sort strictly by manual order
      rows.sort((a, b) => {
        const idxA = manualOrder.indexOf(a.teamId);
        const idxB = manualOrder.indexOf(b.teamId);
        return idxA - idxB;
      });
    } else {
      // Automatic FIBA sorting
      rows.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.pointsDiff !== a.pointsDiff) return b.pointsDiff - a.pointsDiff;
        if (b.pointsScored !== a.pointsScored) return b.pointsScored - a.pointsScored;
        return a.team.name.localeCompare(b.team.name, 'uk');
      });
    }

    // Assign final rank
    rows.forEach((row, idx) => {
      row.rank = idx + 1;
    });

    return rows;
  }

  // Standings manual manipulation
  public static setStandingsMode(mode: 'auto' | 'manual'): void {
    const db = this.getDatabase();
    db.settings.standingsMode = mode;
    if (mode === 'manual' && (!db.settings.manualOrder || db.settings.manualOrder.length !== db.teams.length)) {
      // Initialize manual order from current auto standings
      const currentStandings = this.calculateStandings(db);
      db.settings.manualOrder = currentStandings.map((s) => s.teamId);
    }
    this.saveDatabase(db);
  }

  public static moveTeamInStandings(teamId: string, direction: 'up' | 'down'): void {
    const db = this.getDatabase();
    let order = db.settings.manualOrder || [];
    if (order.length !== db.teams.length) {
      const current = this.calculateStandings(db);
      order = current.map((s) => s.teamId);
    }

    const idx = order.indexOf(teamId);
    if (idx === -1) return;

    if (direction === 'up' && idx > 0) {
      const temp = order[idx - 1];
      order[idx - 1] = order[idx];
      order[idx] = temp;
    } else if (direction === 'down' && idx < order.length - 1) {
      const temp = order[idx + 1];
      order[idx + 1] = order[idx];
      order[idx] = temp;
    }

    db.settings.standingsMode = 'manual';
    db.settings.manualOrder = [...order];
    this.saveDatabase(db);
  }

  public static updateTeamStandingsOverride(teamId: string, override: StandingsOverride): void {
    const db = this.getDatabase();
    if (!db.settings.standingsOverrides) {
      db.settings.standingsOverrides = {};
    }
    db.settings.standingsOverrides[teamId] = {
      ...(db.settings.standingsOverrides[teamId] || {}),
      ...override,
    };
    db.settings.standingsMode = 'manual';
    this.saveDatabase(db);
  }

  public static resetStandingsOverrides(): void {
    const db = this.getDatabase();
    db.settings.standingsMode = 'auto';
    db.settings.standingsOverrides = {};
    db.settings.manualOrder = [];
    this.saveDatabase(db);
  }

  // Teams CRUD
  public static updateTeam(updatedTeam: Team): void {
    const db = this.getDatabase();
    const idx = db.teams.findIndex((t) => t.id === updatedTeam.id);
    if (idx !== -1) {
      db.teams[idx] = updatedTeam;
      this.saveDatabase(db);
    }
  }

  // Players CRUD
  public static addPlayer(player: Player): void {
    const db = this.getDatabase();
    db.players.push(player);
    this.saveDatabase(db);
  }

  public static updatePlayer(updatedPlayer: Player): void {
    const db = this.getDatabase();
    const idx = db.players.findIndex((p) => p.id === updatedPlayer.id);
    if (idx !== -1) {
      db.players[idx] = updatedPlayer;
      this.saveDatabase(db);
    }
  }

  public static deletePlayer(playerId: string): void {
    const db = this.getDatabase();
    db.players = db.players.filter((p) => p.id !== playerId);
    this.saveDatabase(db);
  }

  // Matches CRUD
  public static addMatch(match: Match): void {
    const db = this.getDatabase();
    db.matches.push(match);
    this.saveDatabase(db);
  }

  public static updateMatch(updatedMatch: Match): void {
    const db = this.getDatabase();
    const idx = db.matches.findIndex((m) => m.id === updatedMatch.id);
    if (idx !== -1) {
      db.matches[idx] = updatedMatch;
      this.saveDatabase(db);
    }
  }

  public static deleteMatch(matchId: string): void {
    const db = this.getDatabase();
    db.matches = db.matches.filter((m) => m.id !== matchId);
    this.saveDatabase(db);
  }

  // News CRUD
  public static addNews(newsItem: NewsItem): void {
    const db = this.getDatabase();
    db.news.unshift(newsItem);
    this.saveDatabase(db);
  }

  public static updateNews(updatedNews: NewsItem): void {
    const db = this.getDatabase();
    const idx = db.news.findIndex((n) => n.id === updatedNews.id);
    if (idx !== -1) {
      db.news[idx] = updatedNews;
      this.saveDatabase(db);
    }
  }

  public static deleteNews(newsId: string): void {
    const db = this.getDatabase();
    db.news = db.news.filter((n) => n.id !== newsId);
    this.saveDatabase(db);
  }

  // Final Four Management
  public static updateFinalFour(config: FinalFourConfig): void {
    const db = this.getDatabase();
    db.finalFour = config;
    this.saveDatabase(db);
  }

  // MVP Awards CRUD & Leaderboard
  public static addMvpAward(award: RoundMvpAward): void {
    const db = this.getDatabase();
    if (!db.mvpAwards) db.mvpAwards = [];
    db.mvpAwards.unshift(award);
    this.saveDatabase(db);
  }

  public static updateMvpAward(award: RoundMvpAward): void {
    const db = this.getDatabase();
    if (!db.mvpAwards) db.mvpAwards = [];
    const idx = db.mvpAwards.findIndex((a) => a.id === award.id);
    if (idx !== -1) {
      db.mvpAwards[idx] = award;
      this.saveDatabase(db);
    }
  }

  public static deleteMvpAward(awardId: string): void {
    const db = this.getDatabase();
    if (!db.mvpAwards) return;
    db.mvpAwards = db.mvpAwards.filter((a) => a.id !== awardId);
    this.saveDatabase(db);
  }

  public static getMvpLeaderboard(db?: LeagueDatabase): MvpPlayerLeaderboard[] {
    const database = db || this.getDatabase();
    const awards = database.mvpAwards || [];
    const map = new Map<string, {
      playerName: string;
      teamId: string;
      awards: RoundMvpAward[];
      photoUrl?: string;
    }>();

    awards.forEach((award) => {
      const key = `${award.playerName.trim().toLowerCase()}_${award.teamId}`;
      const existing = map.get(key);
      if (existing) {
        existing.awards.push(award);
        if (!existing.photoUrl && award.photoUrl) existing.photoUrl = award.photoUrl;
      } else {
        map.set(key, {
          playerName: award.playerName,
          teamId: award.teamId,
          awards: [award],
          photoUrl: award.photoUrl,
        });
      }
    });

    const list: MvpPlayerLeaderboard[] = Array.from(map.values()).map((item) => ({
      playerName: item.playerName,
      teamId: item.teamId,
      mvpCount: item.awards.length,
      awards: item.awards.sort((a, b) => b.round - a.round),
      photoUrl: item.photoUrl,
    }));

    return list.sort((a, b) => b.mvpCount - a.mvpCount);
  }

  // Seed sample round 1 results
  public static populateDemoResults(): void {
    const db = this.getDatabase();
    if (db.matches.length >= 4) {
      db.matches[0].status = 'completed';
      db.matches[0].homeScore = 78;
      db.matches[0].awayScore = 71;
      db.matches[0].quarters = { q1Home: 20, q1Away: 18, q2Home: 22, q2Away: 19, q3Home: 17, q3Away: 16, q4Home: 19, q4Away: 18 };

      db.matches[1].status = 'completed';
      db.matches[1].homeScore = 84;
      db.matches[1].awayScore = 89;
      db.matches[1].quarters = { q1Home: 21, q1Away: 24, q2Home: 23, q2Away: 20, q3Home: 18, q3Away: 22, q4Home: 22, q4Away: 23 };

      db.matches[2].status = 'completed';
      db.matches[2].homeScore = 92;
      db.matches[2].awayScore = 68;
      db.matches[2].quarters = { q1Home: 25, q1Away: 15, q2Home: 24, q2Away: 17, q3Home: 21, q3Away: 18, q4Home: 22, q4Away: 18 };

      db.matches[3].status = 'completed';
      db.matches[3].homeScore = 65;
      db.matches[3].awayScore = 74;
      db.matches[3].quarters = { q1Home: 14, q1Away: 19, q2Home: 18, q2Away: 17, q3Home: 16, q3Away: 20, q4Home: 17, q4Away: 18 };
      
      this.saveDatabase(db);
    }
  }

  public static clearAllResults(): void {
    const db = this.getDatabase();
    db.matches.forEach((m) => {
      m.status = 'upcoming';
      delete m.homeScore;
      delete m.awayScore;
      delete m.quarters;
    });
    this.saveDatabase(db);
  }
}

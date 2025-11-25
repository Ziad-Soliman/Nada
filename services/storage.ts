
import { PlayerState, StudentDatabase, ClassId, GameStats, CharacterConfig, GameId } from '../types';

const STORAGE_KEY = 'majesty_maths_db_v1';

// Initial empty stats helper
const getInitialStats = (): Record<GameId, GameStats> => {
    const emptyStat = { highScore: 0, timesPlayed: 0, totalScore: 0, medals: { gold: 0, silver: 0, bronze: 0 } };
    return {
        space: { ...emptyStat },
        dino: { ...emptyStat },
        cave: { ...emptyStat },
        ocean: { ...emptyStat },
        city: { ...emptyStat },
        time: { ...emptyStat }
    };
};

export const generateId = (firstName: string, lastName: string, classId: string): string => {
    return `${firstName.trim().toLowerCase()}-${lastName.trim().toLowerCase()}-${classId}`.replace(/\s+/g, '');
};

export const getDatabase = (): StudentDatabase => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Failed to load database", e);
        return {};
    }
};

export const saveDatabase = (db: StudentDatabase) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
        console.error("Failed to save database", e);
    }
};

export const getStudent = (firstName: string, lastName: string, classId: ClassId): PlayerState | null => {
    const db = getDatabase();
    const id = generateId(firstName, lastName, classId);
    return db[id] || null;
};

export const saveStudentProgress = (player: PlayerState) => {
    const db = getDatabase();
    // Update the record
    db[player.id] = {
        ...player,
        lastPlayed: new Date().toISOString()
    };
    saveDatabase(db);
};

export const createNewStudent = (firstName: string, lastName: string, classId: ClassId, character: CharacterConfig): PlayerState => {
    const id = generateId(firstName, lastName, classId);
    return {
        id,
        firstName,
        lastName,
        classId,
        character,
        score: 0,
        streak: 0,
        hasShield: false,
        hintsUsed: 0,
        history: [],
        stats: getInitialStats(),
        lastPlayed: new Date().toISOString()
    };
};

export const getAllStudents = (): PlayerState[] => {
    const db = getDatabase();
    return Object.values(db).sort((a, b) => new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime());
};

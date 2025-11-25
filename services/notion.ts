import { PlayerState, GameId } from '../types';

export const syncScoreToNotion = async (player: PlayerState, gameId: GameId, score: number, rank: string, hintsUsed: number) => {
    try {
        const gameTitles: Record<GameId, string> = {
            space: 'Space Station Saver',
            dino: 'Dino Discovery',
            cave: 'Crystal Cave',
            ocean: 'Ocean Odyssey',
            city: 'Sky City Builder'
        };

        const payload = {
            student: {
                firstName: player.firstName,
                lastName: player.lastName,
                classId: player.classId,
                id: player.id
            },
            game: {
                id: gameId,
                title: gameTitles[gameId]
            },
            stats: {
                score,
                rank,
                hintsUsed
            }
        };

        const response = await fetch('/api/sync-notion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.warn('Failed to sync to Notion via Vercel API');
        } else {
            console.log('Successfully synced game data to Notion');
        }
    } catch (e) {
        console.error("Error syncing to Notion:", e);
    }
};
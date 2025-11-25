
import { PlayerState, GameId } from '../types';

const isLocalhost = () => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const sendToApi = async (payload: any) => {
    if (isLocalhost()) {
        console.warn("NOTION SYNC WARNING: You are running on localhost. The /api/sync-notion route will likely fail (404/500) unless you are running 'vercel dev'.");
    }

    try {
        console.log("📡 Syncing to Notion...", payload);

        const response = await fetch('/api/sync-notion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            if (!response.ok) {
                console.error('❌ Notion Sync Error:', result);
                if (result.details) console.error(`   Details: ${result.details}`);
            } else {
                console.log('✅ Notion Sync Success:', result);
            }
        } else {
            const text = await response.text();
            console.error(`❌ Notion Sync Critical Error (${response.status}):`, text.substring(0, 200));
        }

    } catch (e) {
        console.error("❌ Network Error calling Notion API:", e);
    }
};

export const syncScoreToNotion = async (player: PlayerState, gameId: GameId, score: number, maxScore: number, rank: string, hintsUsed: number) => {
    // We send the full title. If Notion allows creating options, new game IDs will work automatically.
    const gameTitles: Record<GameId, string> = {
        space: 'Space Station Saver',
        dino: 'Dino Discovery',
        cave: 'Crystal Cave',
        ocean: 'Ocean Odyssey',
        city: 'Sky City Builder'
    };
    
    // Fallback for future games not in list
    const title = gameTitles[gameId] || gameId.charAt(0).toUpperCase() + gameId.slice(1);

    const payload = {
        student: {
            firstName: player.firstName,
            lastName: player.lastName,
            classId: player.classId,
            id: player.id
        },
        game: {
            id: gameId,
            title: title
        },
        stats: {
            score,
            maxScore,
            rank, // Sent as "Outcome" to Notion
            hintsUsed
        }
    };

    await sendToApi(payload);
};

export const syncProfileToNotion = async (player: PlayerState) => {
    const payload = {
        student: {
            firstName: player.firstName,
            lastName: player.lastName,
            classId: player.classId,
            id: player.id
        }
        // No game or stats data
    };
    
    await sendToApi(payload);
};


import { PlayerState, GameId } from '../types';

const isLocalhost = () => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

const sendToApi = async (payload: any) => {
    if (isLocalhost()) {
        console.warn("⚠️ localhost detected. Vercel API routes usually require 'vercel dev'.");
    }

    try {
        console.log("📡 Sending Payload to Notion:", JSON.stringify(payload, null, 2));

        const response = await fetch('/api/sync-notion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const result = await response.json();
            if (!response.ok) {
                console.error('❌ Sync Failed:', result);
                if (result.details) console.error(`   Details: ${result.details}`);
            } else {
                console.log('✅ Sync Success:', result);
                if (result.warning) console.warn('   ⚠️ Warning:', result.warning);
            }
        } else {
            console.error(`❌ Server Error ${response.status}:`, await response.text());
        }

    } catch (e) {
        console.error("❌ Network Error:", e);
    }
};

export const syncScoreToNotion = async (player: PlayerState, gameId: GameId, score: number, maxScore: number, rank: string, hintsUsed: number) => {
    const gameTitles: Record<GameId, string> = {
        space: 'Space Station Saver',
        dino: 'Dino Discovery',
        cave: 'Crystal Cave',
        ocean: 'Ocean Odyssey',
        city: 'Sky City Builder'
    };
    
    const title = gameTitles[gameId] || gameId.charAt(0).toUpperCase() + gameId.slice(1);

    const payload = {
        student: {
            firstName: player.firstName,
            lastName: player.lastName,
            classId: player.classId,
            id: player.id
        },
        game: { id: gameId, title: title },
        stats: { score, maxScore, rank, hintsUsed }
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
    };
    await sendToApi(payload);
};

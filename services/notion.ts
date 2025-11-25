import { PlayerState, GameId } from '../types';

export const syncScoreToNotion = async (player: PlayerState, gameId: GameId, score: number, rank: string, hintsUsed: number) => {
    
    // Check for Localhost environment issues
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn("NOTION SYNC WARNING: You are running on localhost. The /api/sync-notion route will likely fail (404/500) unless you are running 'vercel dev'. Standard 'npm run dev' does not support serverless functions.");
    }

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
            // If response is not JSON (e.g., standard Vercel 404/500 HTML page)
            const text = await response.text();
            console.error(`❌ Notion Sync Critical Error (${response.status}):`, text.substring(0, 200));
        }

    } catch (e) {
        console.error("❌ Network Error calling Notion API:", e);
    }
};
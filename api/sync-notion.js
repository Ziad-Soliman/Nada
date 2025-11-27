
import { Client } from '@notionhq/client';

// Helper to extract ID from URL or Raw ID
const cleanNotionId = (id) => {
    if (!id) return null;
    if (id.includes('notion.so')) {
        const match = id.match(/([a-f0-9]{32})/);
        return match ? match[1] : id;
    }
    return id;
};

// Helper to safely extract property values
const getPropValue = (prop) => {
    if (!prop) return null;
    if (prop.type === 'title' && prop.title?.length > 0) return prop.title[0].plain_text;
    if (prop.type === 'rich_text' && prop.rich_text?.length > 0) return prop.rich_text[0].plain_text;
    if (prop.type === 'number') return prop.number;
    if (prop.type === 'select') return prop.select?.name;
    if (prop.type === 'date') return prop.date?.start;
    return null;
};

export default async function handler(req, res) {
  // --- ENVIRONMENT VARIABLES ---
  const NOTION_API_KEY = process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.trim() : null;
  const STUDENT_DB_ID = process.env.NOTION_STUDENT_DB_ID ? cleanNotionId(process.env.NOTION_STUDENT_DB_ID.trim()) : null;
  const LOGS_DB_ID = process.env.NOTION_LOGS_DB_ID ? cleanNotionId(process.env.NOTION_LOGS_DB_ID.trim()) : null;

  if (!NOTION_API_KEY || !STUDENT_DB_ID) {
    console.error("Missing Env Vars");
    return res.status(500).json({ 
        error: 'Server Configuration Error', 
        details: `Missing Vercel Environment Variables (NOTION_API_KEY or NOTION_STUDENT_DB_ID).` 
    });
  }

  const notion = new Client({ auth: NOTION_API_KEY });

  // === HANDLE GET: FETCH STUDENTS ===
  if (req.method === 'GET') {
      try {
          const response = await notion.databases.query({
              database_id: STUDENT_DB_ID,
              sorts: [
                  { property: 'Last Played', direction: 'descending' }
              ]
          });

          const students = response.results.map(page => {
              const props = page.properties;
              return {
                  id: page.id,
                  firstName: getPropValue(props['First Name']) || 'Unknown',
                  lastName: getPropValue(props['Last Name']) || '',
                  classId: getPropValue(props['Class']) || 'N/A',
                  totalScore: getPropValue(props['Total XP']) || 0,
                  lastPlayed: getPropValue(props['Last Played']) || new Date().toISOString(),
                  // We don't store Rank explicitly usually, but we can infer or if it exists
                  rank: getPropValue(props['Rank']) || 'Cadet' 
              };
          });

          return res.status(200).json({ success: true, data: students });

      } catch (error) {
          console.error("Notion Fetch Error:", error);
          return res.status(500).json({ error: 'Fetch Failed', details: error.message });
      }
  }

  // === HANDLE POST: SYNC DATA ===
  if (req.method === 'POST') {
    if (!LOGS_DB_ID) {
        return res.status(500).json({ error: 'Missing Logs DB ID' });
    }

    const { student, game, stats } = req.body;
    
    // SANITIZE INPUTS
    const scoreToAdd = stats ? Number(stats.score) : 0;
    
    // Prepare stats safely if they exist
    const safeStats = stats ? {
        score: Number(stats.score),
        maxScore: Number(stats.maxScore || 100),
        hintsUsed: Number(stats.hintsUsed || 0),
        rank: String(stats.rank || "Participant"),
    } : null;
    
    const studentUniqueId = `${student.firstName} ${student.lastName} ${student.classId}`.toUpperCase();

    try {
        // --- STEP 1: FIND OR CREATE STUDENT ---
        let notionPageId;
        let currentTotalXP = 0;
        let existingStudent = null;

        // Helper to search by column name
        const findStudentByColumn = async (colName) => {
            return await notion.databases.query({
                database_id: STUDENT_DB_ID,
                filter: { property: colName, title: { equals: studentUniqueId } },
            });
        };

        try {
            const response = await findStudentByColumn('Student ID');
            if (response.results.length > 0) existingStudent = response.results[0];
        } catch (e) {
            try {
                const response = await findStudentByColumn('Name');
                if (response.results.length > 0) existingStudent = response.results[0];
            } catch (e2) {
                 // Schema might be different, try just creating.
            }
        }

        if (existingStudent) {
            // UPDATE EXISTING
            notionPageId = existingStudent.id;
            const xpProp = existingStudent.properties['Total XP'];
            if (xpProp && xpProp.number !== undefined) currentTotalXP = xpProp.number;

            try {
                const updateProps = { 'Last Played': { date: { start: new Date().toISOString() } } };
                if (scoreToAdd > 0) updateProps['Total XP'] = { number: currentTotalXP + scoreToAdd };
                await notion.pages.update({ page_id: notionPageId, properties: updateProps });
            } catch (updateError) {
                console.warn("Failed to update Student Profile XP:", updateError.message);
            }
        } else {
            // CREATE NEW
            const studentProps = {
                'First Name': { rich_text: [{ text: { content: String(student.firstName) } }] },
                'Last Name': { rich_text: [{ text: { content: String(student.lastName) } }] },
                'Class': { select: { name: String(student.classId) } },
                'Total XP': { number: scoreToAdd },
                'Last Played': { date: { start: new Date().toISOString() } }
            };

            try {
                const newPage = await notion.pages.create({
                    parent: { database_id: STUDENT_DB_ID },
                    properties: { ...studentProps, 'Student ID': { title: [{ text: { content: studentUniqueId } }] } },
                });
                notionPageId = newPage.id;
            } catch (e) {
                 try {
                    const newPage = await notion.pages.create({
                        parent: { database_id: STUDENT_DB_ID },
                        properties: { ...studentProps, 'Name': { title: [{ text: { content: studentUniqueId } }] } },
                    });
                    notionPageId = newPage.id;
                 } catch (createError) {
                     return res.status(400).json({ error: 'Create Student Failed', details: createError.message });
                 }
            }
        }

        // --- STEP 2: CREATE MISSION LOG ---
        if (game && safeStats) {
            const missionTitle = `${game.title} - ${new Date().toLocaleDateString()}`;
            
            // Define payload strategies
            const createPayload = (titleColName, includeDetails) => {
                const base = {
                    'Student': { relation: [{ id: notionPageId }] },
                    [titleColName]: { title: [{ text: { content: missionTitle } }] }
                };
                
                if (includeDetails) {
                    return {
                        ...base,
                        'Game Mode': { select: { name: String(game.title) } },
                        'Score': { number: safeStats.score },
                        'Max Score': { number: safeStats.maxScore },
                        'Outcome': { select: { name: safeStats.rank } },
                        'Hints Used': { number: safeStats.hintsUsed }
                    };
                }
                return base;
            };

            const tryCreateLog = async (titleCol, details) => {
                return await notion.pages.create({
                    parent: { database_id: LOGS_DB_ID },
                    properties: createPayload(titleCol, details)
                });
            };

            // Attempt strategies to save the log
            try {
                await tryCreateLog('Mission Name', true);
            } catch (err1) {
                try {
                    await tryCreateLog('Name', true);
                } catch (err2) {
                    // Safe mode fallbacks
                    try {
                        await tryCreateLog('Mission Name', false);
                    } catch (err3) {
                        try {
                           await tryCreateLog('Name', false);
                        } catch (err4) {
                           console.warn("Log creation failed completely", err4.message);
                        }
                    }
                }
            }
        }

        return res.status(200).json({ success: true, message: "Synced successfully" });

    } catch (error) {
        console.error('Fatal Error:', error);
        return res.status(500).json({ error: 'Sync Failed', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

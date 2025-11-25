
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- ENVIRONMENT VARIABLES ---
  const NOTION_API_KEY = process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.trim() : null;
  const STUDENT_DB_ID = process.env.NOTION_STUDENT_DB_ID ? cleanNotionId(process.env.NOTION_STUDENT_DB_ID.trim()) : null;
  const LOGS_DB_ID = process.env.NOTION_LOGS_DB_ID ? cleanNotionId(process.env.NOTION_LOGS_DB_ID.trim()) : null;

  if (!NOTION_API_KEY || !STUDENT_DB_ID || !LOGS_DB_ID) {
    console.error("Missing Env Vars");
    return res.status(500).json({ 
        error: 'Server Configuration Error', 
        details: `Missing Vercel Environment Variables. Please Redeploy.` 
    });
  }

  const { student, game, stats } = req.body;
  
  // SANITIZE INPUTS (Fixes validation_errors caused by string/number mismatches)
  const scoreToAdd = stats ? Number(stats.score) : 0;
  
  // Prepare stats safely if they exist
  const safeStats = stats ? {
      score: Number(stats.score),
      maxScore: Number(stats.maxScore || 100),
      hintsUsed: Number(stats.hintsUsed || 0),
      rank: String(stats.rank || "Participant"),
  } : null;
  
  const notion = new Client({ auth: NOTION_API_KEY });
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
             return res.status(400).json({ error: 'Schema Error', details: "Could not find 'Student ID' or 'Name' column in Student DB." });
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
                // Full data - strictly typed
                return {
                    ...base,
                    'Game Mode': { select: { name: String(game.title) } },
                    'Score': { number: safeStats.score },
                    'Max Score': { number: safeStats.maxScore },
                    'Outcome': { select: { name: safeStats.rank } },
                    'Hints Used': { number: safeStats.hintsUsed }
                };
            }
            return base; // Minimal data (Safe Mode)
        };

        const tryCreateLog = async (titleCol, details) => {
            return await notion.pages.create({
                parent: { database_id: LOGS_DB_ID },
                properties: createPayload(titleCol, details)
            });
        };

        // ATTEMPT 1: Full Data with 'Mission Name'
        try {
            await tryCreateLog('Mission Name', true);
        } catch (err1) {
            console.warn("Attempt 1 (Full - Mission Name) Failed:", err1.message);
            
            // ATTEMPT 2: Full Data with 'Name' (Default title col)
            try {
                await tryCreateLog('Name', true);
            } catch (err2) {
                console.warn("Attempt 2 (Full - Name) Failed:", err2.message);

                // ATTEMPT 3: SAFE MODE (Minimal Data - No custom columns) with 'Mission Name'
                try {
                    await tryCreateLog('Mission Name', false);
                    return res.status(200).json({ 
                        success: true, 
                        message: "Synced (Safe Mode)", 
                        warning: "Full sync failed. Basic log created. Check columns: 'Score', 'Max Score', 'Outcome', 'Game Mode'." 
                    });
                } catch (err3) {
                     // ATTEMPT 4: SAFE MODE with 'Name'
                     try {
                        await tryCreateLog('Name', false);
                        return res.status(200).json({ 
                            success: true, 
                            message: "Synced (Safe Mode)", 
                            warning: "Full sync failed. Basic log created. Check columns: 'Score', 'Max Score', 'Outcome', 'Game Mode'." 
                        });
                     } catch (err4) {
                        return res.status(400).json({ 
                            error: 'Log Sync Failed', 
                            details: `All attempts failed. Last error: ${err4.message}. Ensure 'Student' relation column exists.` 
                        });
                     }
                }
            }
        }
    }

    res.status(200).json({ success: true, message: "Synced successfully" });

  } catch (error) {
    console.error('Fatal Error:', error);
    res.status(500).json({ error: 'Sync Failed', details: error.message });
  }
}

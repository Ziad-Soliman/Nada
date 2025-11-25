
import { Client } from '@notionhq/client';

// Helper to extract ID from URL or Raw ID
const cleanNotionId = (id) => {
    if (!id) return null;
    // If it's a full URL, extract the 32 char ID before the query params
    if (id.includes('notion.so')) {
        const match = id.match(/([a-f0-9]{32})/);
        return match ? match[1] : id;
    }
    return id;
};

export default async function handler(req, res) {
  // Ensure we are running as a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- ENVIRONMENT VARIABLE DEBUGGING ---
  const availableEnvKeys = Object.keys(process.env).filter(k => k.startsWith('NOTION_'));
  console.log("Function invoked. Available NOTION_ keys:", availableEnvKeys);

  // Safely access, trim, and clean variables
  const NOTION_API_KEY = process.env.NOTION_API_KEY ? process.env.NOTION_API_KEY.trim() : null;
  const STUDENT_DB_ID = process.env.NOTION_STUDENT_DB_ID ? cleanNotionId(process.env.NOTION_STUDENT_DB_ID.trim()) : null;
  const LOGS_DB_ID = process.env.NOTION_LOGS_DB_ID ? cleanNotionId(process.env.NOTION_LOGS_DB_ID.trim()) : null;

  // Validate presence
  const missingVars = [];
  if (!NOTION_API_KEY) missingVars.push('NOTION_API_KEY');
  if (!STUDENT_DB_ID) missingVars.push('NOTION_STUDENT_DB_ID');
  if (!LOGS_DB_ID) missingVars.push('NOTION_LOGS_DB_ID');

  if (missingVars.length > 0) {
    console.error("CRITICAL ERROR: Missing Environment Variables:", missingVars);
    return res.status(500).json({ 
        error: 'Server Configuration Error', 
        details: `Missing the following Vercel Environment Variables: ${missingVars.join(', ')}. IMPORTANT: You must REDEPLOY your project after adding variables.` 
    });
  }

  const { student, game, stats } = req.body;
  const scoreToAdd = stats ? stats.score : 0;
  
  // Initialize Notion
  const notion = new Client({ auth: NOTION_API_KEY });
  const studentUniqueId = `${student.firstName} ${student.lastName} ${student.classId}`.toUpperCase();

  try {
    // --- STEP 1: FIND OR CREATE STUDENT ---
    
    let notionPageId;
    let currentTotalXP = 0;
    let existingStudent = null;

    const findStudentByColumn = async (colName) => {
        return await notion.databases.query({
            database_id: STUDENT_DB_ID,
            filter: {
                property: colName, 
                title: { equals: studentUniqueId },
            },
        });
    };

    // Strategy: Try 'Student ID' first (Best Practice), then fallback to 'Name' (Default)
    try {
        const response = await findStudentByColumn('Student ID');
        if (response.results.length > 0) existingStudent = response.results[0];
    } catch (e) {
        console.log("Info: 'Student ID' column not found or query failed. Trying 'Name'...");
        try {
            const response = await findStudentByColumn('Name');
            if (response.results.length > 0) existingStudent = response.results[0];
        } catch (e2) {
             console.error("Search failed on both columns.", e2.body || e2);
             return res.status(400).json({ 
                 error: 'Database Schema Error', 
                 details: `Could not search Student Database. Ensure the Title property is named 'Student ID' or 'Name'. Notion Error: ${e2.code}` 
             });
        }
    }

    if (existingStudent) {
        // UPDATE EXISTING
        notionPageId = existingStudent.id;
        
        // Safely extract current XP
        const xpProp = existingStudent.properties['Total XP'];
        if (xpProp && xpProp.number !== undefined && xpProp.number !== null) {
            currentTotalXP = xpProp.number;
        }

        try {
            // Only update XP if we actually have a score to add
            const updateProps = {
                'Last Played': { date: { start: new Date().toISOString() } }
            };
            if (scoreToAdd > 0) {
                updateProps['Total XP'] = { number: currentTotalXP + scoreToAdd };
            }

            await notion.pages.update({
                page_id: notionPageId,
                properties: updateProps
            });
        } catch (updateError) {
            console.warn("Failed to update Student Profile:", updateError.message);
        }

    } else {
        // CREATE NEW
        const studentProps = {
            'First Name': { rich_text: [{ text: { content: student.firstName } }] },
            'Last Name': { rich_text: [{ text: { content: student.lastName } }] },
            'Class': { select: { name: student.classId } },
            'Total XP': { number: scoreToAdd },
            'Last Played': { date: { start: new Date().toISOString() } }
        };

        try {
            const newPage = await notion.pages.create({
                parent: { database_id: STUDENT_DB_ID },
                properties: {
                    ...studentProps,
                    'Student ID': { title: [{ text: { content: studentUniqueId } }] }
                },
            });
            notionPageId = newPage.id;
        } catch (e) {
             console.log("Info: Failed to create with 'Student ID', trying 'Name'...");
             try {
                const newPage = await notion.pages.create({
                    parent: { database_id: STUDENT_DB_ID },
                    properties: {
                        ...studentProps,
                        'Name': { title: [{ text: { content: studentUniqueId } }] }
                    },
                });
                notionPageId = newPage.id;
             } catch (createError) {
                 console.error("Create failed:", createError.body || createError);
                 return res.status(400).json({ 
                    error: 'Create Student Failed', 
                    details: `Ensure columns 'First Name', 'Last Name', 'Class', 'Total XP' exist. Notion Error: ${createError.code}` 
                 });
             }
        }
    }

    // --- STEP 2: CREATE MISSION LOG (Only if Game Data provided) ---
    
    if (game && stats) {
        const logProps = {
            'Student': { relation: [{ id: notionPageId }] },
            'Game Mode': { select: { name: game.title } }, // Can be new value if column is Select
            'Score': { number: stats.score },
            'Max Score': { number: stats.maxScore || 100 },
            'Outcome': { select: { name: stats.rank } }, // Can be new value if column is Select
            'Hints Used': { number: stats.hintsUsed }
        };
        
        const missionTitle = `${game.title} - ${new Date().toLocaleDateString()}`;

        try {
            await notion.pages.create({
                parent: { database_id: LOGS_DB_ID },
                properties: {
                    ...logProps,
                    'Mission Name': { title: [{ text: { content: missionTitle } }] }
                }
            });
        } catch (e) {
            console.log("Info: Failed to create log with 'Mission Name', trying 'Name'...");
            try {
                await notion.pages.create({
                    parent: { database_id: LOGS_DB_ID },
                    properties: {
                        ...logProps,
                        'Name': { title: [{ text: { content: missionTitle } }] }
                    }
                });
            } catch (logError) {
                console.error("Log failed:", logError.body || logError);
                return res.status(400).json({ 
                    error: 'Create Log Failed', 
                    details: `Ensure columns 'Student', 'Game Mode', 'Score', 'Max Score', 'Outcome' exist and are of correct type (Select/Number). If you get 'validation_error' on Selects, ensure column is Select not Status. Notion Error: ${logError.code}` 
                });
            }
        }
    }

    res.status(200).json({ success: true, message: "Synced successfully" });

  } catch (error) {
    console.error('Unhandled Notion Sync Error:', error);
    res.status(500).json({ 
        error: 'Sync Failed', 
        details: error.message 
    });
  }
}

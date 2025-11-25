import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { student, game, stats } = req.body;

  // Initialize Notion Client
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const STUDENT_DB_ID = process.env.NOTION_STUDENT_DB_ID;
  const LOGS_DB_ID = process.env.NOTION_LOGS_DB_ID;

  if (!process.env.NOTION_API_KEY || !STUDENT_DB_ID || !LOGS_DB_ID) {
    console.error("Server Error: Missing Environment Variables");
    return res.status(500).json({ 
        error: 'Server Configuration Error', 
        details: 'Missing NOTION_API_KEY, NOTION_STUDENT_DB_ID, or NOTION_LOGS_DB_ID in Vercel settings.' 
    });
  }

  const studentUniqueId = `${student.firstName} ${student.lastName} ${student.classId}`.toUpperCase();

  try {
    // --- STEP 1: FIND OR CREATE STUDENT ---
    
    let notionPageId;
    let currentTotalXP = 0;
    let existingStudent = null;

    // Helper to search using a specific column name
    const findStudentByColumn = async (colName) => {
        return await notion.databases.query({
            database_id: STUDENT_DB_ID,
            filter: {
                property: colName, 
                title: { equals: studentUniqueId },
            },
        });
    };

    // Try finding by "Student ID" first, then "Name"
    try {
        const response = await findStudentByColumn('Student ID');
        if (response.results.length > 0) existingStudent = response.results[0];
    } catch (e) {
        console.log("Could not find column 'Student ID', trying 'Name'...");
        try {
            const response = await findStudentByColumn('Name');
            if (response.results.length > 0) existingStudent = response.results[0];
        } catch (e2) {
             console.error("Search failed on both 'Student ID' and 'Name'.", e2);
             throw new Error(`Could not query Student Database. Ensure the Title column is named 'Student ID' or 'Name'. Notion Error: ${e2.message}`);
        }
    }

    if (existingStudent) {
        // --- UPDATE EXISTING STUDENT ---
        notionPageId = existingStudent.id;
        
        // Safely extract current XP
        if (existingStudent.properties['Total XP'] && existingStudent.properties['Total XP'].number) {
            currentTotalXP = existingStudent.properties['Total XP'].number;
        }

        try {
            await notion.pages.update({
                page_id: notionPageId,
                properties: {
                    'Total XP': { number: currentTotalXP + stats.score },
                    'Last Played': { date: { start: new Date().toISOString() } }
                }
            });
        } catch (updateError) {
            console.warn("Failed to update XP (non-critical):", updateError.message);
        }

    } else {
        // --- CREATE NEW STUDENT ---
        // We try to create with 'Student ID' as the title key. If it fails, we try 'Name'.
        const studentProps = {
            'First Name': { rich_text: [{ text: { content: student.firstName } }] },
            'Last Name': { rich_text: [{ text: { content: student.lastName } }] },
            'Class': { select: { name: student.classId } },
            'Total XP': { number: stats.score },
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
             console.log("Failed to create with 'Student ID', trying 'Name'...");
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
                 console.error("Create Student Failed:", createError);
                 throw new Error(`Failed to create student. Check if columns 'First Name', 'Last Name', 'Class', 'Total XP' exist in the database. Notion Error: ${createError.message}`);
             }
        }
    }

    // --- STEP 2: CREATE MISSION LOG ---
    
    const logProps = {
        'Student': { relation: [{ id: notionPageId }] },
        'Game Mode': { select: { name: game.title } },
        'Score': { number: stats.score },
        'Outcome': { select: { name: stats.rank } },
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
        console.log("Failed to create log with 'Mission Name', trying 'Name'...");
        try {
            await notion.pages.create({
                parent: { database_id: LOGS_DB_ID },
                properties: {
                    ...logProps,
                    'Name': { title: [{ text: { content: missionTitle } }] }
                }
            });
        } catch (logError) {
            console.error("Create Log Failed:", logError);
            throw new Error(`Failed to create Mission Log. Check if columns 'Student', 'Game Mode', 'Score', 'Outcome' exist. Notion Error: ${logError.message}`);
        }
    }

    res.status(200).json({ success: true, message: "Synced successfully" });

  } catch (error) {
    console.error('Notion Sync Error:', error);
    res.status(500).json({ 
        error: 'Sync Failed', 
        details: error.message 
    });
  }
}
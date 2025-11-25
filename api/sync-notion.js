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
    return res.status(500).json({ error: 'Missing Server Configuration' });
  }

  try {
    // 1. Generate unique Student ID string matches the one in local storage
    // We use "FIRST LAST CLASS" as the visual identifier in Notion
    const studentUniqueId = `${student.firstName} ${student.lastName} ${student.classId}`.toUpperCase();

    // 2. Search for student in Notion
    const response = await notion.databases.query({
      database_id: STUDENT_DB_ID,
      filter: {
        property: 'Student ID',
        title: {
          equals: studentUniqueId,
        },
      },
    });

    let notionPageId;
    let currentTotalXP = 0;

    if (response.results.length > 0) {
      // Student exists
      const page = response.results[0];
      notionPageId = page.id;
      
      // Get current XP if it exists to add to it
      if (page.properties['Total XP'] && page.properties['Total XP'].number) {
        currentTotalXP = page.properties['Total XP'].number;
      }
      
      // Update Total XP and Last Played
      await notion.pages.update({
        page_id: notionPageId,
        properties: {
          'Total XP': { number: currentTotalXP + stats.score },
          'Last Played': { date: { start: new Date().toISOString() } }
        }
      });

    } else {
      // Create new Student
      const newPage = await notion.pages.create({
        parent: { database_id: STUDENT_DB_ID },
        properties: {
          'Student ID': { title: [{ text: { content: studentUniqueId } }] },
          'First Name': { rich_text: [{ text: { content: student.firstName } }] },
          'Last Name': { rich_text: [{ text: { content: student.lastName } }] },
          'Class': { select: { name: student.classId } },
          'Total XP': { number: stats.score },
          'Last Played': { date: { start: new Date().toISOString() } }
        },
      });
      notionPageId = newPage.id;
    }

    // 3. Add to Mission Logs
    await notion.pages.create({
      parent: { database_id: LOGS_DB_ID },
      properties: {
        'Mission Name': { title: [{ text: { content: `${game.title} - ${new Date().toLocaleDateString()}` } }] },
        'Student': { relation: [{ id: notionPageId }] },
        'Game Mode': { select: { name: game.title } },
        'Score': { number: stats.score },
        'Outcome': { select: { name: stats.rank } },
        'Hints Used': { number: stats.hintsUsed }
      }
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notion Sync Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
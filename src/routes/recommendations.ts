import { t } from 'elysia';
import { Database } from 'bun:sqlite';

export function recommendationsRoutes(app: any, db: Database) {
  app.get("/recommendations/:userId", async ({ params: { userId } }: { params: { userId: string } }) => {
    // Step 1: Get all liked snippets of the user
    const likedSnippets = db.query(`
      SELECT s.id as snippetId, s.book_id FROM swipes sw
      JOIN snippets s ON sw.snippet_id = s.id
      WHERE sw.userId = ? AND sw.direction = 'like'
    `).all(userId);

    if (!likedSnippets.length) {
      return { message: "No likes found for user to base recommendations on" };
    }

    // Step 2: Get all tags associated with books of these snippets
    const bookIds = likedSnippets.map((s: any) => s.book_id);
    
    const placeholders = bookIds.map(() => '?').join(',');

    // Check if book_tags table exists
    const tables = db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='book_tags'").all();
    if (tables.length === 0) {
      return { error: "book_tags table for book-tag relationships not found" };
    }

    const tags = db.query(`
      SELECT DISTINCT t.name FROM tags t
      JOIN book_tags bt ON bt.tag_id = t.id
      WHERE bt.book_id IN (${placeholders})
    `).all(...bookIds);

    if (!tags.length) {
      return { message: "No tags found from user's liked books" };
    }

    // Step 3: Pick random tag
    const randomTag = (tags[Math.floor(Math.random() * tags.length)] as { name: string }).name;

    // Step 4: Call Open Library API to search books by tag
    const openLibraryUrl = `https://openlibrary.org/subjects/${encodeURIComponent(randomTag.toLowerCase())}.json?limit=10`;

    try {
      const response = await fetch(openLibraryUrl);
      if (!response.ok) {
        return { error: "Failed to fetch from Open Library API" };
      }
      const data = await response.json();

      // Step 5: Pick random book from results
      if (!data.works || data.works.length === 0) {
        return { message: "No books found for tag on Open Library" };
      }
      const randomBook = data.works[Math.floor(Math.random() * data.works.length)];

      // Return book info as stub recommendation
      return {
        recommendationTag: randomTag,
        book: {
          title: randomBook.title,
          authors: randomBook.authors?.map((a: { name: any; }) => a.name).join(", ") || "Unknown",
          key: randomBook.key,
          cover_id: randomBook.cover_id
        }
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  });
}

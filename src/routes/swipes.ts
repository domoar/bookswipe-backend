import { t } from 'elysia';

import { Database } from 'bun:sqlite';

export function swipesRoutes(app: any, db: Database) {
  app.get("/swipe/next", () => {
    return db.query(`
      SELECT s.id as snippetId, s.content, s.bg_image, b.title, b.author 
      FROM snippets s 
      JOIN books b ON s.book_id = b.id 
      ORDER BY RANDOM() LIMIT 1
    `).get();
  });

  app.post("/swipe", ({ body }: { body: { userId: string; snippetId: number; direction: string } }) => {
    const { userId, snippetId, direction } = body;
    db.prepare("INSERT INTO swipes (userId, snippet_id, direction) VALUES (?, ?, ?)").run(userId, snippetId, direction);
    return { success: true };
  }, {
    body: t.Object({
      userId: t.String(),
      snippetId: t.Number(),
      direction: t.String()
    })
  });

  app.get("/matches/:userId", ({ params: { userId } }: { params: { userId: string } }) => {
    return db.query(`
      SELECT DISTINCT b.* FROM books b
      JOIN snippets s ON s.book_id = b.id
      JOIN swipes sw ON sw.snippet_id = s.id
      WHERE sw.userId = ? AND sw.direction = 'like'
    `).all(userId);
  }, {
    params: t.Object({ userId: t.String() })
  });
}

import { t } from 'elysia';
import { Database } from 'bun:sqlite';

export function snippetsRoutes(app: any, db: Database) {
  app.get("/snippets", () => {
    return db.query("SELECT * FROM snippets").all();
  });

  app.get("/snippets/:id", ({ params: { id } }: { params: { id: number } }) => {
    return db.query("SELECT * FROM snippets WHERE id = ?").get(id);
  }, {
    params: t.Object({ id: t.Number() })
  });

  app.post("/snippets", ({ body }: { body: { book_id: number; content: string; bg_image?: string } }) => {
    const { book_id, content, bg_image } = body;
    const result = db.prepare("INSERT INTO snippets (book_id, content, bg_image) VALUES (?, ?, ?)").run(book_id, content, bg_image ?? '');
    return { id: result.lastInsertRowid, book_id, content, bg_image };
  }, {
    body: t.Object({
      book_id: t.Number(),
      content: t.String(),
      bg_image: t.Optional(t.String())
    })
  });

  app.put("/snippets/:id", ({ params: { id }, body }: { params: { id: number }; body: { book_id: number; content: string; bg_image?: string } }) => {
    const { book_id, content, bg_image } = body;
    db.prepare("UPDATE snippets SET book_id = ?, content = ?, bg_image = ? WHERE id = ?").run(book_id, content, bg_image ?? '', id);
    return { id, book_id, content, bg_image };
  }, {
    params: t.Object({ id: t.Number() }),
    body: t.Object({
      book_id: t.Number(),
      content: t.String(),
      bg_image: t.Optional(t.String())
    })
  });

  app.delete("/snippets/:id", ({ params: { id } }: { params: { id: number } }) => {
    db.prepare("DELETE FROM snippets WHERE id = ?").run(id);
    return { success: true };
  }, {
    params: t.Object({ id: t.Number() })
  });
}

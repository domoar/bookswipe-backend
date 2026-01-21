import { t } from 'elysia';
import { Database } from 'bun:sqlite';

export function tagsRoutes(app: any, db: Database) {
  app.get("/tags", () => {
    return db.query("SELECT * FROM tags").all();
  });

  app.get("/tags/:id", ({ params: { id } }: { params: { id: number } }) => {
    return db.query("SELECT * FROM tags WHERE id = ?").get(id);
  }, {
    params: t.Object({ id: t.Number() })
  });

  app.post("/tags", ({ body }: { body: { name: string } }) => {
    const { name } = body;
    const result = db.prepare("INSERT INTO tags (name) VALUES (?)").run(name);
    return { id: result.lastInsertRowid, name };
  }, {
    body: t.Object({ name: t.String() })
  });

  app.put("/tags/:id", ({ params: { id }, body }: { params: { id: number }; body: { name: string } }) => {
    const { name } = body;
    db.prepare("UPDATE tags SET name = ? WHERE id = ?").run(name, id);
    return { id, name };
  }, {
    params: t.Object({ id: t.Number() }),
    body: t.Object({ name: t.String() })
  });

  app.delete("/tags/:id", ({ params: { id } }: { params: { id: number } }) => {
    db.prepare("DELETE FROM tags WHERE id = ?").run(id);
    return { success: true };
  }, {
    params: t.Object({ id: t.Number() })
  });
}

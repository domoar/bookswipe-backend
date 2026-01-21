import { t } from 'elysia';
import { Database } from 'bun:sqlite';

export function usersRoutes(app: any, db: Database) {
  app.get("/users", () => {
    return db.query("SELECT * FROM users").all();
  });

  app.get("/users/:id", ({ params: { id } }: { params: { id: number } }) => {
    return db.query("SELECT * FROM users WHERE id = ?").get(id);
  }, {
    params: t.Object({ id: t.Number() })
  });

  app.post("/users", ({ body }: { body: { username: string, email: string } }) => {
    const { username, email } = body;
    const result = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)").run(username, email);
    return { id: result.lastInsertRowid, username, email };
  }, {
    body: t.Object({
      username: t.String(),
      email: t.String()
    })
  });

  app.put("/users/:id", ({ params: { id }, body }: { params: { id: number }, body: { username: string, email: string } }) => {
    const { username, email } = body;
    db.prepare("UPDATE users SET username = ?, email = ? WHERE id = ?").run(username, email, id);
    return { id, username, email };
  }, {
    params: t.Object({ id: t.Number() }),
    body: t.Object({
      username: t.String(),
      email: t.String()
    })
  });

  app.delete("/users/:id", ({ params: { id } }: { params: { id: number } }) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    return { success: true };
  }, {
    params: t.Object({ id: t.Number() })
  });
}

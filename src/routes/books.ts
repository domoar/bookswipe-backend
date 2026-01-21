import { Database } from 'bun:sqlite';

export function booksRoutes(app: any, db: Database) {
  app.get("/books", () => {
    return db.query("SELECT * FROM books").all();
  });
}

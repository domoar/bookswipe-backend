import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Database } from 'bun:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const dbPath = '/data/books.db';

const dir = dirname(dbPath);
if (!existsSync(dir) && dir !== '/') {
    try {
        mkdirSync(dir, { recursive: true });
    } catch (e) {
        console.warn("Konnte /data nicht erstellen, weiche auf lokalen Pfad aus.");
    }
}

const db = new Database(dbPath);

db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT, author TEXT, cover TEXT
  );
  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    content TEXT,
    bg_image TEXT,
    FOREIGN KEY(book_id) REFERENCES books(id)
  );
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
  CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT,
    snippet_id INTEGER,
    direction TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const check = db.query("SELECT COUNT(*) as total FROM books").get() as { total: number };

if (check.total === 0) {
    console.log("Seeding BookSwipe Data...");
    
    // Bücher einfügen & IDs speichern
    const b1 = db.prepare("INSERT INTO books (title, author, cover) VALUES (?, ?, ?)").run(
        'Dune', 'Frank Herbert', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f'
    ).lastInsertRowid;
    
    const b2 = db.prepare("INSERT INTO books (title, author, cover) VALUES (?, ?, ?)").run(
        '1984', 'George Orwell', 'https://images.unsplash.com/photo-1541963463532-d68292c34b19'
    ).lastInsertRowid;

    // Snippets einfügen
    const insertSnippet = db.prepare("INSERT INTO snippets (book_id, content, bg_image) VALUES (?, ?, ?)");
    
    insertSnippet.run(Number(b1), 'Ich darf keine Angst haben. Die Angst tötet das Bewusstsein.', 'https://images.unsplash.com/photo-1506466010722-395aa2bef877');
    insertSnippet.run(Number(b2), 'Wer die Vergangenheit kontrolliert, kontrolliert die Zukunft.', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c');
    
    console.log("Seeding abgeschlossen.");
}

const app = new Elysia()
    .use(cors())
    .get("/swipe/next", () => {
        return db.query(`
            SELECT s.id as snippetId, s.content, s.bg_image, b.title, b.author 
            FROM snippets s 
            JOIN books b ON s.book_id = b.id 
            ORDER BY RANDOM() LIMIT 1
        `).get();
    })
    .post("/swipe", ({ body }) => {
        const { userId, snippetId, direction } = body;
        db.prepare("INSERT INTO swipes (userId, snippet_id, direction) VALUES (?, ?, ?)").run(userId, snippetId, direction);
        return { success: true };
    }, {
        body: t.Object({
            userId: t.String(),
            snippetId: t.Number(),
            direction: t.String()
        })
    })
    .get("/matches/:userId", ({ params: { userId } }) => {
        return db.query(`
            SELECT DISTINCT b.* FROM books b
            JOIN snippets s ON s.book_id = b.id
            JOIN swipes sw ON sw.snippet_id = s.id
            WHERE sw.userId = ? AND sw.direction = 'like'
        `).all(userId);
    }, {
        params: t.Object({
            userId: t.String()
        })
    })
    .get("/books", () => {
        return db.query("SELECT * FROM books").all();
    })
    .listen(3001);

console.log("BookSwipe Backend läuft auf http://localhost:3001");
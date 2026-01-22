import { Database } from 'bun:sqlite';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

export const dbPath = join(import.meta.dir, '../data/books.db');

// Erstelle das data-Verzeichnis, falls es nicht existiert
const dataDir = join(import.meta.dir, '../data');
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
}

export const seedDatabase = (db: Database) => {
    // Erstelle Tabellen, falls sie nicht existieren
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE
        );
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author TEXT,
            cover TEXT,
            publisher TEXT,
            isbn TEXT,
            buy_link TEXT
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
            userId INTEGER,
            snippet_id INTEGER,
            direction TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(userId) REFERENCES users(id),
            FOREIGN KEY(snippet_id) REFERENCES snippets(id)
        );
    `);

    const check = db.query("SELECT COUNT(*) as total FROM books").get() as { total: number };

    if (check.total === 0) {
        console.log("Seeding BookSwipe Data...");

        // Seeding Users
        const user1Id = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)").run(
            'alice',
            'alice@example.com'
        ).lastInsertRowid;

        const user2Id = db.prepare("INSERT INTO users (username, email) VALUES (?, ?)").run(
            'bob',
            'bob@example.com'
        ).lastInsertRowid;

        // Seeding Books
        const book1Id = db.prepare("INSERT INTO books (title, author, cover, publisher, isbn, buy_link) VALUES (?, ?, ?, ?, ?, ?)").run(
            'Dune',
            'Frank Herbert',
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
            'Chilton Books',
            '978-0441013593',
            'https://example.com/dune'
        ).lastInsertRowid;

        const book2Id = db.prepare("INSERT INTO books (title, author, cover, publisher, isbn, buy_link) VALUES (?, ?, ?, ?, ?, ?)").run(
            '1984',
            'George Orwell',
            'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
            'Secker & Warburg',
            '978-0451524935',
            'https://example.com/1984'
        ).lastInsertRowid;

        // Seeding Snippets
        const snippet1Id = db.prepare("INSERT INTO snippets (book_id, content, bg_image) VALUES (?, ?, ?)").run(
            book1Id,
            'Ich darf keine Angst haben. Die Angst tötet das Bewusstsein.',
            'https://images.unsplash.com/photo-1506466010722-395aa2bef877'
        ).lastInsertRowid;

        const snippet2Id = db.prepare("INSERT INTO snippets (book_id, content, bg_image) VALUES (?, ?, ?)").run(
            book2Id,
            'Wer die Vergangenheit kontrolliert, kontrolliert die Zukunft.',
            'https://images.unsplash.com/photo-1509248961158-e54f6934749c'
        ).lastInsertRowid;

        // Seeding Tags
        const tag1Id = db.prepare("INSERT INTO tags (name) VALUES (?)").run('Science Fiction').lastInsertRowid;
        const tag2Id = db.prepare("INSERT INTO tags (name) VALUES (?)").run('Dystopian').lastInsertRowid;

        // Seeding Swipes
        db.prepare("INSERT INTO swipes (userId, snippet_id, direction) VALUES (?, ?, ?)").run(
            user1Id, snippet1Id, 'like'
        );
        db.prepare("INSERT INTO swipes (userId, snippet_id, direction) VALUES (?, ?, ?)").run(
            user2Id, snippet2Id, 'dislike'
        );

        console.log("Seeding abgeschlossen.");
    }
};

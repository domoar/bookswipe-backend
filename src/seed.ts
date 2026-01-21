export const dbPath = '/data/books.db';

import { Database } from 'bun:sqlite';

export const seedDatabase = (db: Database) => {
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

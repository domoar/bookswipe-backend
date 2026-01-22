import type { Database } from 'bun:sqlite';
import type { Book } from '../types';

export const libraryRoutes = (app: any, db: Database) => {
    // GET /api/library - Alle gelikten Bücher eines Users
    app.get('/api/library', ({ query }: any) => {
        const userId = query.userId || 'guest';

        // Hole alle gelikten Buch-IDs
        const likedBookIds = db.query(`
            SELECT DISTINCT bookId 
            FROM swipes 
            WHERE userId = ? AND direction = 'right'
            ORDER BY timestamp DESC
        `).all(userId) as any[];

        if (likedBookIds.length === 0) {
            return [];
        }

        // Hole die kompletten Bücher
        const bookIds = likedBookIds.map(row => row.bookId);
        const placeholders = bookIds.map(() => '?').join(',');
        
        const rows = db.query(`
            SELECT * FROM books 
            WHERE id IN (${placeholders})
        `).all(...bookIds) as any[];

        const books: Book[] = rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            year: row.year,
            genre: row.genre,
            subGenres: JSON.parse(row.subGenres),
            coverImage: row.coverImage,
            quotes: JSON.parse(row.quotes),
            description: row.description,
            pageCount: row.pageCount,
            rating: row.rating
        }));

        return books;
    });
};

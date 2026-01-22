import type { Database } from 'bun:sqlite';
import type { Book } from '../types';

export const bookRoutes = (app: any, db: Database) => {
    // GET /api/books - Alle Bücher
    app.get('/api/books', () => {
        const rows = db.query('SELECT * FROM books').all() as any[];
        
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

    // GET /api/books/:id - Einzelnes Buch
    app.get('/api/books/:id', ({ params }: any) => {
        const { id } = params;
        
        const row = db.query('SELECT * FROM books WHERE id = ?').get(id) as any;
        
        if (!row) {
            return new Response(JSON.stringify({ error: 'Book not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const book: Book = {
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
        };

        return book;
    });
};

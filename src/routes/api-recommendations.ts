import type { Database } from 'bun:sqlite';
import type { Book, RecommendationsResponse } from '../types';

interface BookWithScore {
    book: Book;
    score: number;
}

export const recommendationsRoutes = (app: any, db: Database) => {
    // GET /api/recommendations - Personalisierte Empfehlungen
    app.get('/api/recommendations', ({ query }: any) => {
        const userId = query.userId || 'guest';

        // Hole alle gelikten Bücher des Users
        const likedBooks = db.query(`
            SELECT b.* FROM books b
            JOIN swipes s ON b.id = s.bookId
            WHERE s.userId = ? AND s.direction = 'right'
        `).all(userId) as any[];

        if (likedBooks.length === 0) {
            // Keine Likes -> Gebe zufällige Bücher zurück
            const allBooks = db.query('SELECT * FROM books LIMIT 5').all() as any[];
            const books: Book[] = allBooks.map(parseBookRow);
            
            const matchPercentages: { [bookId: string]: number } = {};
            books.forEach(book => {
                matchPercentages[book.id] = 50; // Neutral
            });

            return {
                recommendations: books,
                matchPercentages
            };
        }

        // Parse gelikte Bücher
        const parsedLikedBooks: Book[] = likedBooks.map(parseBookRow);

        // Hole alle Bücher außer die bereits gelikten
        const likedIds = parsedLikedBooks.map(b => b.id);
        const placeholders = likedIds.map(() => '?').join(',');
        
        const candidateBooks = db.query(`
            SELECT * FROM books 
            WHERE id NOT IN (${placeholders})
        `).all(...likedIds) as any[];

        // Berechne Match-Score für jedes Kandidaten-Buch
        const booksWithScores: BookWithScore[] = candidateBooks.map(row => {
            const book = parseBookRow(row);
            const score = calculateMatchScore(book, parsedLikedBooks);
            return { book, score };
        });

        // Sortiere nach Score (höchste zuerst)
        booksWithScores.sort((a, b) => b.score - a.score);

        // Nehme Top 10
        const topRecommendations = booksWithScores.slice(0, 10);

        const recommendations = topRecommendations.map(item => item.book);
        const matchPercentages: { [bookId: string]: number } = {};
        
        topRecommendations.forEach(item => {
            matchPercentages[item.book.id] = Math.round(item.score);
        });

        const response: RecommendationsResponse = {
            recommendations,
            matchPercentages
        };

        return response;
    });
};

// Helper: Parse Datenbank-Row zu Book-Object
function parseBookRow(row: any): Book {
    return {
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
}

// Helper: Berechne Match-Score (0-100)
// Genre: 40%, Subgenre: 30%, Autor: 15%, Jahr: 15%
function calculateMatchScore(candidateBook: Book, likedBooks: Book[]): number {
    let genreScore = 0;
    let subGenreScore = 0;
    let authorScore = 0;
    let yearScore = 0;

    for (const likedBook of likedBooks) {
        // Genre Match (40%)
        if (candidateBook.genre === likedBook.genre) {
            genreScore += 40;
        }

        // Subgenre Match (30%)
        const matchingSubGenres = candidateBook.subGenres.filter(sg => 
            likedBook.subGenres.includes(sg)
        );
        const subGenreMatchRatio = matchingSubGenres.length / Math.max(candidateBook.subGenres.length, 1);
        subGenreScore += subGenreMatchRatio * 30;

        // Autor Match (15%)
        if (candidateBook.author === likedBook.author) {
            authorScore += 15;
        }

        // Jahr Nähe (15%)
        const yearDiff = Math.abs(candidateBook.year - likedBook.year);
        const yearProximity = Math.max(0, 1 - (yearDiff / 100)); // Je näher, desto besser
        yearScore += yearProximity * 15;
    }

    // Durchschnitt über alle gelikten Bücher
    const avgScore = (genreScore + subGenreScore + authorScore + yearScore) / likedBooks.length;

    // Begrenze auf 0-100
    return Math.min(100, Math.max(0, avgScore));
}

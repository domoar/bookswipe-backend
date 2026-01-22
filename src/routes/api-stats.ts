import type { Database } from 'bun:sqlite';
import type { StatsResponse } from '../types';

export const statsRoutes = (app: any, db: Database) => {
    // GET /api/stats - User-Statistiken
    app.get('/api/stats', ({ query }: any) => {
        const userId = query.userId || 'guest';

        // Total Swipes
        const totalSwipes = (db.query(`
            SELECT COUNT(*) as count FROM swipes WHERE userId = ?
        `).get(userId) as any).count;

        // Total Likes
        const totalLikes = (db.query(`
            SELECT COUNT(*) as count FROM swipes WHERE userId = ? AND direction = 'right'
        `).get(userId) as any).count;

        // Total Read (vorläufig gleich wie totalLikes)
        const totalRead = totalLikes;

        // Top Genres
        const topGenresRows = db.query(`
            SELECT b.genre, COUNT(*) as count
            FROM swipes s
            JOIN books b ON s.bookId = b.id
            WHERE s.userId = ? AND s.direction = 'right'
            GROUP BY b.genre
            ORDER BY count DESC
            LIMIT 5
        `).all(userId) as any[];

        const topGenres = topGenresRows.map(row => row.genre);

        const stats: StatsResponse = {
            totalSwipes,
            totalLikes,
            totalRead,
            topGenres
        };

        return stats;
    });
};

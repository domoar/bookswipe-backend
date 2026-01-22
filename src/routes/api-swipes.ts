import type { Database } from 'bun:sqlite';
import { t } from 'elysia';

export const swipeRoutes = (app: any, db: Database) => {
    // POST /api/swipe - Einzelnen Swipe speichern
    app.post('/api/swipe', ({ body }: any) => {
        const { bookId, direction, userId = 'guest' } = body;

        db.prepare('INSERT INTO swipes (bookId, direction, userId) VALUES (?, ?, ?)')
            .run(bookId, direction, userId);

        return new Response(null, { status: 200 });
    }, {
        body: t.Object({
            bookId: t.String(),
            direction: t.Union([t.Literal('left'), t.Literal('right')]),
            userId: t.Optional(t.String())
        })
    });

    // POST /api/swipe/complete - Komplette Swipe-Session
    app.post('/api/swipe/complete', ({ body }: any) => {
        const { likedBookIds, rejectedBookIds, userId = 'guest' } = body;

        // Speichere alle gelikten Bücher
        const insertSwipe = db.prepare('INSERT INTO swipes (bookId, direction, userId) VALUES (?, ?, ?)');
        
        for (const bookId of likedBookIds) {
            insertSwipe.run(bookId, 'right', userId);
        }

        for (const bookId of rejectedBookIds) {
            insertSwipe.run(bookId, 'left', userId);
        }

        return new Response(null, { status: 200 });
    }, {
        body: t.Object({
            likedBookIds: t.Array(t.String()),
            rejectedBookIds: t.Array(t.String()),
            userId: t.Optional(t.String())
        })
    });
};

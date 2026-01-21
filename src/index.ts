import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Database } from 'bun:sqlite';
import { seedDatabase, dbPath } from './seed';

import { swipesRoutes } from './routes/swipes';
import { usersRoutes } from './routes/users';
import { tagsRoutes } from './routes/tags';
import { snippetsRoutes } from './routes/snippets';
import { booksRoutes } from './routes/books';
import { recommendationsRoutes } from './routes/recommendations';

const db = new Database(dbPath);
seedDatabase(db);

const app = new Elysia();

app.use(cors());

swipesRoutes(app, db);
usersRoutes(app, db);
tagsRoutes(app, db);
snippetsRoutes(app, db);
booksRoutes(app, db);
recommendationsRoutes(app, db);

app.listen(3001);

console.log("BookSwipe Backend running on http://localhost:3001");
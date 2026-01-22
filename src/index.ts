import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { Database } from 'bun:sqlite';
import { dbPath, initDatabase, seedBooks } from './database';

// Import neue API Routes
import { bookRoutes } from './routes/api-books';
import { swipeRoutes } from './routes/api-swipes';
import { libraryRoutes } from './routes/api-library';
import { statsRoutes } from './routes/api-stats';
import { recommendationsRoutes } from './routes/api-recommendations';

// Datenbank initialisieren
const db = new Database(dbPath);
initDatabase(db);
seedBooks(db);

const app = new Elysia();

// CORS für Frontend (localhost:3000)
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

// API Routes registrieren
bookRoutes(app, db);
swipeRoutes(app, db);
libraryRoutes(app, db);
statsRoutes(app, db);
recommendationsRoutes(app, db);

// Health Check
app.get('/health', () => ({ status: 'ok' }));

// Server auf Port 8000
app.listen(8000);

console.log("🚀 BookSwipe Backend running on http://localhost:8000");
console.log("📚 API Base URL: http://localhost:8000/api");
console.log("✅ CORS enabled for localhost:3000");
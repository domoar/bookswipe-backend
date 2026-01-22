# 📚 BookSwipe Backend

**Tinder für Bücher** - Backend API für die BookSwipe App

## 🚀 Quick Start

```bash
# Dependencies installieren
bun install

# Server starten (Port 8000)
bun --watch src/index.ts
```

Server läuft auf: **http://localhost:8000**

---

## 📡 API Endpoints

### Base URL: `http://localhost:8000/api`

### 1. **GET /api/books**
Gibt alle verfügbaren Bücher zurück.

**Response:**
```json
[
  {
    "id": "1",
    "title": "Der große Gatsby",
    "author": "F. Scott Fitzgerald",
    "year": 1925,
    "genre": "Klassiker",
    "subGenres": ["Amerikanische Literatur", "Tragödie", "Gesellschaftskritik"],
    "coverImage": "https://...",
    "quotes": [
      { "text": "So treiben wir dahin...", "page": 180 }
    ],
    "description": "Eine Geschichte über Liebe, Träume...",
    "pageCount": 180,
    "rating": 4.4
  }
]
```

---

### 2. **GET /api/books/:id**
Gibt ein spezifisches Buch zurück.

**Parameter:**
- `id` (string) - Buch-ID

**Response:** Einzelnes `Book` Object oder `404`

---

### 3. **POST /api/swipe**
Speichert eine Swipe-Aktion (wird bei JEDEM Swipe aufgerufen).

**Body:**
```json
{
  "bookId": "1",
  "direction": "right",  // "left" oder "right"
  "userId": "user123"    // optional
}
```

**Response:** `200 OK`

---

### 4. **POST /api/swipe/complete**
Wird aufgerufen, wenn User alle Bücher geswipt hat.

**Body:**
```json
{
  "likedBookIds": ["1", "3", "5"],
  "rejectedBookIds": ["2", "4"],
  "userId": "user123"  // optional
}
```

**Response:** `200 OK`

---

### 5. **GET /api/recommendations**
Gibt personalisierte Buchempfehlungen basierend auf Swipe-History.

**Query Parameter:**
- `userId` (optional) - User ID

**Response:**
```json
{
  "recommendations": [ /* Array von Books */ ],
  "matchPercentages": {
    "1": 87,
    "3": 76,
    "5": 65
  }
}
```

**Algorithmus:**
- Genre-Übereinstimmung: 40%
- Subgenre-Übereinstimmung: 30%
- Autor-Ähnlichkeit: 15%
- Jahr-Nähe: 15%

Sortiert nach Match-Prozent (höchste zuerst).

---

### 6. **GET /api/library**
Gibt alle gelikten Bücher eines Users zurück.

**Query Parameter:**
- `userId` (optional) - User ID

**Response:** Array von `Book` Objects (nur "right" geswipt)

---

### 7. **GET /api/stats** (Optional)
User-Statistiken.

**Query Parameter:**
- `userId` (optional) - User ID

**Response:**
```json
{
  "totalSwipes": 50,
  "totalLikes": 12,
  "totalRead": 12,
  "topGenres": ["Fantasy", "Klassiker", "Science Fiction"]
}
```

---

## 📖 Bücher-Datenbank

Das Backend enthält **12 deutsche Bücher**:

1. Der große Gatsby (F. Scott Fitzgerald, 1925)
2. 1984 (George Orwell, 1949)
3. Harry Potter und der Stein der Weisen (J.K. Rowling, 1997)
4. Der Alchemist (Paulo Coelho, 1988)
5. Die Verwandlung (Franz Kafka, 1915)
6. Der Herr der Ringe (Tolkien, 1954)
7. Die Tribute von Panem (Suzanne Collins, 2008)
8. Stolz und Vorurteil (Jane Austen, 1813)
9. Shining (Stephen King, 1977)
10. Dune (Frank Herbert, 1965)
11. Der Fänger im Roggen (J.D. Salinger, 1951)
12. Die Säulen der Erde (Ken Follett, 1989)

Jedes Buch enthält:
- ✅ 3-5 berühmte Zitate
- ✅ Beschreibung (2-3 Sätze)
- ✅ 2-4 Subgenres
- ✅ Rating (1-5)
- ✅ Seitenzahl

---

## 🛠️ Tech Stack

- **Runtime:** Bun
- **Framework:** Elysia
- **Datenbank:** SQLite
- **CORS:** Aktiviert für `localhost:3000`

---

## 📂 Projekt-Struktur

```
src/
├── index.ts                    # Main Server (Port 8000)
├── types.ts                    # TypeScript Interfaces
├── database.ts                 # DB Schema & Seed Data
└── routes/
    ├── api-books.ts            # GET /api/books, /api/books/:id
    ├── api-swipes.ts           # POST /api/swipe, /api/swipe/complete
    ├── api-library.ts          # GET /api/library
    ├── api-stats.ts            # GET /api/stats
    └── api-recommendations.ts  # GET /api/recommendations
```

---

## 🔧 Entwicklung

```bash
# Dependencies installieren
bun install

# Development Server (mit Hot Reload)
bun --watch src/index.ts

# Datenbank löschen & neu initialisieren
rm -rf data/books.db && bun --watch src/index.ts
```

---

## ✨ Features

✅ **Keine Authentication** - Wie gewünscht  
✅ **CORS aktiviert** - Frontend auf `localhost:3000`  
✅ **Error Handling** - 404 & 500 Responses  
✅ **Swipe-History** - Für Empfehlungen gespeichert  
✅ **Match-Algorithmus** - Genre, Subgenre, Autor, Jahr  
✅ **TypeScript Types** - Exakt wie im Frontend  

---

## 🌐 Frontend Integration

Das Frontend ist in **Next.js** und verwendet `fetch()` für alle Requests.

**Beispiel:**
```typescript
// Alle Bücher holen
const books = await fetch('http://localhost:8000/api/books').then(r => r.json());

// Swipe speichern
await fetch('http://localhost:8000/api/swipe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookId: '1', direction: 'right', userId: 'user123' })
});
```

---

## 📝 API Dokumentation

Siehe `API_INTEGRATION.md` für detaillierte API-Spezifikationen (falls vorhanden im Frontend).

---

## 🐛 Troubleshooting

**Problem:** Port 8000 bereits belegt  
**Lösung:** Ändere Port in `src/index.ts` → `app.listen(8001)`

**Problem:** CORS Fehler  
**Lösung:** Prüfe ob Frontend auf `localhost:3000` läuft

**Problem:** Keine Empfehlungen  
**Lösung:** User muss mind. 1 Buch liken

---

## 📄 License

MIT

---

**Happy Swiping! 📚❤️**

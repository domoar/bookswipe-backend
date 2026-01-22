# 🚀 BookSwipe Backend - Setup Complete!

## ✅ Status: LÄUFT!

**Server:** http://localhost:8000  
**API Base:** http://localhost:8000/api  
**CORS:** Aktiviert für localhost:3000

---

## 📚 API Endpoints (7 Stück)

### 1. GET /api/books
Alle Bücher (12 Stück mit deutschen Titeln)

### 2. GET /api/books/:id  
Einzelnes Buch nach ID

### 3. POST /api/swipe
```json
{
  "bookId": "1",
  "direction": "left" | "right",
  "userId": "optional"
}
```

### 4. POST /api/swipe/complete
```json
{
  "likedBookIds": ["1", "3"],
  "rejectedBookIds": ["2"],
  "userId": "optional"
}
```

### 5. GET /api/recommendations?userId=xxx
Personalisierte Empfehlungen mit Match-Prozenten

### 6. GET /api/library?userId=xxx
Alle gelikten Bücher

### 7. GET /api/stats?userId=xxx
User-Statistiken

---

## 📖 Bücher-Datenbank (12 Bücher)

✅ Der große Gatsby (1925, Klassiker)  
✅ 1984 (1949, Dystopie)  
✅ Harry Potter (1997, Fantasy)  
✅ Der Alchemist (1988, Philosophie)  
✅ Die Verwandlung (1915, Klassiker)  
✅ Der Herr der Ringe (1954, Fantasy)  
✅ Die Tribute von Panem (2008, Dystopie)  
✅ Stolz und Vorurteil (1813, Romance)  
✅ Shining (1977, Thriller)  
✅ Dune (1965, Science Fiction)  
✅ Der Fänger im Roggen (1951, Klassiker)  
✅ Die Säulen der Erde (1989, Historischer Roman)

Jedes Buch hat:
- 3-5 berühmte Zitate mit Seitenzahlen
- Beschreibung (2-3 Sätze)
- 2-4 Subgenres
- Rating (1-5)
- Seitenzahl

---

## 🤖 Empfehlungs-Algorithmus

**Match-Score Berechnung:**
- Genre-Übereinstimmung: 40%
- Subgenre-Übereinstimmung: 30%
- Autor-Ähnlichkeit: 15%
- Jahr-Nähe: 15%

Empfehlungen werden nach Match-Prozent sortiert (höchste zuerst).

---

## 🚀 Server starten

```bash
cd /Users/alperredzepov/Desktop/bookswipe-backend/bookswipe-backend
bun --watch src/index.ts
```

Oder im Hintergrund:
```bash
bun src/index.ts &
```

---

## 🧪 API Tests

```bash
# Health Check
curl http://localhost:8000/health

# Alle Bücher
curl http://localhost:8000/api/books

# Ein Buch
curl http://localhost:8000/api/books/1

# Swipe speichern
curl -X POST http://localhost:8000/api/swipe \
  -H "Content-Type: application/json" \
  -d '{"bookId":"1","direction":"right","userId":"test123"}'

# Empfehlungen
curl "http://localhost:8000/api/library?userId=test123"

# Stats
curl "http://localhost:8000/api/stats?userId=test123"
```

---

## 📂 Projekt-Struktur

```
bookswipe-backend/
├── src/
│   ├── index.ts              # Main Server (Port 8000)
│   ├── types.ts              # TypeScript Interfaces
│   ├── database.ts           # DB Schema & 12 Bücher
│   └── routes/
│       ├── api-books.ts      # GET /api/books, /api/books/:id
│       ├── api-swipes.ts     # POST /api/swipe, /api/swipe/complete
│       ├── api-library.ts    # GET /api/library
│       ├── api-stats.ts      # GET /api/stats
│       └── api-recommendations.ts  # GET /api/recommendations
├── data/
│   └── books.db              # SQLite Datenbank
├── package.json
├── API_DOCS.md               # Vollständige API Dokumentation
└── START_HERE.md             # Diese Datei
```

---

## ✨ Features

✅ **Book Interface** - Exakt wie im Frontend spezifiziert  
✅ **Keine Auth** - Wie gewünscht  
✅ **CORS** - Für localhost:3000  
✅ **12 deutsche Bücher** - Mit Quotes, Beschreibungen, Subgenres  
✅ **Empfehlungs-Algorithmus** - Genre, Subgenre, Autor, Jahr  
✅ **Error Handling** - 404 & 500  
✅ **Swipe-History** - Für Recommendations  
✅ **TypeScript Types** - Vollständig typisiert  

---

## 🔧 Entwicklung

```bash
# Dependencies installieren
bun install

# Server mit Hot Reload
bun --watch src/index.ts

# Datenbank neu initialisieren
rm -rf data/books.db && bun --watch src/index.ts
```

---

## 🌐 Frontend Integration

Das Frontend kann jetzt diese URLs verwenden:

```typescript
const API_BASE = 'http://localhost:8000/api';

// Beispiele
await fetch(`${API_BASE}/books`);
await fetch(`${API_BASE}/books/1`);
await fetch(`${API_BASE}/swipe`, { 
  method: 'POST',
  body: JSON.stringify({ bookId: '1', direction: 'right' })
});
```

---

## 🎯 Next Steps

1. **Frontend starten** auf Port 3000
2. **Backend läuft bereits** auf Port 8000
3. **Testen:** Bücher swipen und Empfehlungen anschauen!

---

**Happy Swiping! 📚❤️**

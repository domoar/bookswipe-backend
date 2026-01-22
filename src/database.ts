import { Database } from 'bun:sqlite';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import type { Book } from './types';

export const dbPath = join(import.meta.dir, '../data/books.db');

// Erstelle das data-Verzeichnis, falls es nicht existiert
const dataDir = join(import.meta.dir, '../data');
if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
}

export const initDatabase = (db: Database) => {
    // Neue Tabellen-Struktur für Book Interface
    db.run(`
        CREATE TABLE IF NOT EXISTS books (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER NOT NULL,
            genre TEXT NOT NULL,
            subGenres TEXT NOT NULL,
            coverImage TEXT,
            quotes TEXT NOT NULL,
            description TEXT NOT NULL,
            pageCount INTEGER NOT NULL,
            rating REAL NOT NULL
        );

        CREATE TABLE IF NOT EXISTS swipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookId TEXT NOT NULL,
            direction TEXT NOT NULL,
            userId TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(bookId) REFERENCES books(id)
        );

        CREATE INDEX IF NOT EXISTS idx_swipes_userId ON swipes(userId);
        CREATE INDEX IF NOT EXISTS idx_swipes_bookId ON swipes(bookId);
        CREATE INDEX IF NOT EXISTS idx_swipes_direction ON swipes(direction);
    `);
};

export const seedBooks = (db: Database) => {
    const check = db.query("SELECT COUNT(*) as total FROM books").get() as { total: number };

    if (check.total === 0) {
        console.log("🌱 Seeding BookSwipe Bücher...");

        const books: Book[] = [
            {
                id: "1",
                title: "Der große Gatsby",
                author: "F. Scott Fitzgerald",
                year: 1925,
                genre: "Klassiker",
                subGenres: ["Amerikanische Literatur", "Tragödie", "Gesellschaftskritik", "Jazz Age"],
                coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
                quotes: [
                    { text: "So treiben wir dahin, Boote gegen die Strömung, rastlos zurückgetragen in die Vergangenheit.", page: 180 },
                    { text: "Ich hoffte, sie würde lachen – ein entzückendes, herzliches Lachen, doch stattdessen lachte sie künstlich.", page: 89 },
                    { text: "Persönlichkeit ist eine ununterbrochene Folge erfolgreicher Gesten.", page: 2 },
                    { text: "Es gibt nur das Verfolgte, der Verfolgende, das Beschäftigte und das Müde.", page: 79 }
                ],
                description: "Eine Geschichte über Liebe, Träume und die dunkle Seite des amerikanischen Traums im New York der 1920er Jahre. Gatsby gibt legendäre Partys in der Hoffnung, seine verlorene Liebe Daisy zurückzugewinnen.",
                pageCount: 180,
                rating: 4.4
            },
            {
                id: "2",
                title: "1984",
                author: "George Orwell",
                year: 1949,
                genre: "Dystopie",
                subGenres: ["Science Fiction", "Politische Fiktion", "Social Fiction", "Überwachung"],
                coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
                quotes: [
                    { text: "Wer die Vergangenheit kontrolliert, kontrolliert die Zukunft. Wer die Gegenwart kontrolliert, kontrolliert die Vergangenheit.", page: 37 },
                    { text: "Krieg ist Frieden. Freiheit ist Sklaverei. Unwissenheit ist Stärke.", page: 4 },
                    { text: "Big Brother is watching you.", page: 3 },
                    { text: "Die beste aller möglichen Lügen ist die Wahrheit.", page: 201 }
                ],
                description: "Ein erschreckender Blick auf eine totalitäre Zukunft, in der die Gedankenpolizei jeden Aspekt des Lebens kontrolliert. Winston Smith rebelliert gegen das System und sucht nach Wahrheit und Freiheit.",
                pageCount: 328,
                rating: 4.7
            },
            {
                id: "3",
                title: "Harry Potter und der Stein der Weisen",
                author: "J.K. Rowling",
                year: 1997,
                genre: "Fantasy",
                subGenres: ["Jugendbuch", "Magie", "Coming-of-Age", "Abenteuer"],
                coverImage: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400",
                quotes: [
                    { text: "Es sind unsere Entscheidungen, Harry, die zeigen, wer wir wirklich sind, weit mehr als unsere Fähigkeiten.", page: 333 },
                    { text: "Es braucht sehr viel Mut, sich seinen Feinden entgegenzustellen, aber genauso viel, sich seinen Freunden zu widersetzen.", page: 306 },
                    { text: "Der Spiegel zeigt uns nicht mehr und nicht weniger als das tiefste, verzweifeltste Verlangen unseres Herzens.", page: 213 },
                    { text: "Natürlich passiert es in deinem Kopf, Harry, aber warum sollte das bedeuten, dass es nicht real ist?", page: 723 }
                ],
                description: "Harry Potter entdeckt an seinem 11. Geburtstag, dass er ein Zauberer ist und besucht Hogwarts. Dort findet er Freunde, lernt Magie und muss sich dem dunklen Lord Voldemort stellen.",
                pageCount: 336,
                rating: 4.8
            },
            {
                id: "4",
                title: "Der Alchemist",
                author: "Paulo Coelho",
                year: 1988,
                genre: "Philosophie",
                subGenres: ["Spiritualität", "Selbstfindung", "Parabel", "Abenteuer"],
                coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
                quotes: [
                    { text: "Wenn du etwas willst, dann will das ganze Universum, dass du es erreichst.", page: 22 },
                    { text: "Die Möglichkeit, einen Traum zu verwirklichen, macht das Leben erst interessant.", page: 11 },
                    { text: "Niemand kann der Furcht entkommen, aber wir können sie in einen Verbündeten verwandeln.", page: 148 },
                    { text: "Dein Herz ist dort, wo dein Schatz ist.", page: 127 }
                ],
                description: "Santiago, ein andalusischer Hirte, begibt sich auf eine mystische Reise nach Ägypten, um seinen persönlichen Schatz zu finden. Eine inspirierende Geschichte über das Verfolgen von Träumen.",
                pageCount: 198,
                rating: 4.2
            },
            {
                id: "5",
                title: "Die Verwandlung",
                author: "Franz Kafka",
                year: 1915,
                genre: "Klassiker",
                subGenres: ["Existentialismus", "Absurde Literatur", "Novelle", "Moderne"],
                coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
                quotes: [
                    { text: "Als Gregor Samsa eines Morgens aus unruhigen Träumen erwachte, fand er sich in seinem Bett zu einem ungeheueren Ungeziefer verwandelt.", page: 1 },
                    { text: "War er ein Tier, da ihn Musik so ergriff?", page: 49 },
                    { text: "Ich habe nämlich eine Stellung, die mich viel mehr angreift, als sie es auf dem Geschäft täte.", page: 8 }
                ],
                description: "Gregor Samsa erwacht eines Morgens als riesiges Insekt. Eine surreale Erzählung über Entfremdung, Familie und die Absurdität des modernen Lebens.",
                pageCount: 74,
                rating: 4.1
            },
            {
                id: "6",
                title: "Der Herr der Ringe: Die Gefährten",
                author: "J.R.R. Tolkien",
                year: 1954,
                genre: "Fantasy",
                subGenres: ["Epos", "High Fantasy", "Abenteuer", "Mythologie"],
                coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
                quotes: [
                    { text: "Nicht alle, die wandern, sind verloren.", page: 188 },
                    { text: "Auch die Kleinsten können den Lauf der Zukunft ändern.", page: 363 },
                    { text: "Alles, was wir entscheiden müssen, ist, was wir mit der Zeit anfangen, die uns gegeben ist.", page: 83 },
                    { text: "Ein Ring, sie zu knechten, sie alle zu finden, ins Dunkel zu treiben und ewig zu binden.", page: 65 }
                ],
                description: "Frodo Beutlin muss einen mächtigen Ring zerstören, um Mittelerde vor dem dunklen Herrscher Sauron zu retten. Ein episches Fantasy-Abenteuer voller Freundschaft, Mut und Opferbereitschaft.",
                pageCount: 423,
                rating: 4.9
            },
            {
                id: "7",
                title: "Die Tribute von Panem - Tödliche Spiele",
                author: "Suzanne Collins",
                year: 2008,
                genre: "Dystopie",
                subGenres: ["Young Adult", "Action", "Science Fiction", "Survival"],
                coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
                quotes: [
                    { text: "Mögen die Chancen stets zu euren Gunsten stehen!", page: 19 },
                    { text: "Ich bin kein Produkt der Hungerspiele. Ich bin etwas viel Schlimmeres.", page: 377 },
                    { text: "Feuer brennt heller in der Dunkelheit.", page: 234 },
                    { text: "Hoffnung ist das einzige, was stärker ist als Furcht.", page: 156 }
                ],
                description: "In einer dystopischen Zukunft muss Katniss Everdeen in einem tödlichen Wettkampf um Leben und Tod kämpfen. Eine packende Geschichte über Überleben, Rebellion und die Macht der Hoffnung.",
                pageCount: 414,
                rating: 4.3
            },
            {
                id: "8",
                title: "Stolz und Vorurteil",
                author: "Jane Austen",
                year: 1813,
                genre: "Romance",
                subGenres: ["Klassiker", "Gesellschaftsroman", "Historisch", "Komödie"],
                coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400",
                quotes: [
                    { text: "Es ist eine allgemein anerkannte Wahrheit, dass ein Junggeselle im Besitz eines schönen Vermögens nichts dringender braucht als eine Frau.", page: 1 },
                    { text: "Ich könnte dir viel leichter vergeben, wenn du mich verletzt hättest. Mein Stolz wurde beleidigt.", page: 380 },
                    { text: "Du bist zu großzügig, um mit mir zu spielen.", page: 367 },
                    { text: "Wir sind alle Narren in der Liebe.", page: 229 }
                ],
                description: "Elizabeth Bennet und Mr. Darcy überwinden ihre anfänglichen Vorurteile und verlieben sich in dieser zeitlosen Liebesgeschichte über Standesunterschiede und gesellschaftliche Konventionen im England des 19. Jahrhunderts.",
                pageCount: 432,
                rating: 4.6
            },
            {
                id: "9",
                title: "Shining",
                author: "Stephen King",
                year: 1977,
                genre: "Thriller",
                subGenres: ["Horror", "Psychothriller", "Übernatürlich", "Suspense"],
                coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
                quotes: [
                    { text: "Hier ist Johnny!", page: 447 },
                    { text: "Monsters sind real, und Geister sind auch real. Sie leben in uns, und manchmal gewinnen sie.", page: 302 },
                    { text: "Das Overlook wollte ihn. Es hatte ihn schon immer gewollt.", page: 398 },
                    { text: "REDRUM. REDRUM. REDRUM.", page: 412 }
                ],
                description: "Die Familie Torrance wird Winterwächter des abgelegenen Overlook Hotels. Doch das Hotel hat eine dunkle Vergangenheit und treibt Jack langsam in den Wahnsinn. Ein meisterhafter Horror-Klassiker.",
                pageCount: 447,
                rating: 4.5
            },
            {
                id: "10",
                title: "Dune - Der Wüstenplanet",
                author: "Frank Herbert",
                year: 1965,
                genre: "Science Fiction",
                subGenres: ["Space Opera", "Politik", "Philosophie", "Abenteuer"],
                coverImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
                quotes: [
                    { text: "Ich darf keine Angst haben. Die Angst tötet das Bewusstsein.", page: 6 },
                    { text: "Wer Gewürz kontrolliert, kontrolliert das Universum.", page: 89 },
                    { text: "Die Geheimnisse der Zukunft sind nur den Eingeweihten offenbart.", page: 234 },
                    { text: "Ein Prozess, der nicht von selbst zum Erliegen kommen kann, ist unaufhaltsam.", page: 301 }
                ],
                description: "Paul Atreides wird auf den Wüstenplaneten Arrakis geschickt, wo das kostbarste Gut des Universums abgebaut wird: das Gewürz. Eine epische Geschichte über Politik, Religion und Macht.",
                pageCount: 528,
                rating: 4.8
            },
            {
                id: "11",
                title: "Der Fänger im Roggen",
                author: "J.D. Salinger",
                year: 1951,
                genre: "Klassiker",
                subGenres: ["Coming-of-Age", "Moderne", "Jugendbuch", "Gesellschaftskritik"],
                coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
                quotes: [
                    { text: "Das Zeichen eines unreifen Menschen ist, dass er heldenhaft für eine Sache sterben will, während das Zeichen eines reifen Menschen ist, dass er bescheiden für eine Sache leben will.", page: 244 },
                    { text: "Die Menschen halten mich immer für verrückt, wenn ich etwas tue, das eigentlich recht vernünftig ist.", page: 187 },
                    { text: "Was mich wirklich deprimiert, sind die Filme.", page: 117 }
                ],
                description: "Holden Caulfield erzählt von seinen Tagen nach dem Rauswurf aus dem Internat. Eine ikonische Geschichte über Teenagerangst, Entfremdung und die Schwierigkeit des Erwachsenwerdens.",
                pageCount: 277,
                rating: 3.8
            },
            {
                id: "12",
                title: "Die Säulen der Erde",
                author: "Ken Follett",
                year: 1989,
                genre: "Historischer Roman",
                subGenres: ["Mittelalter", "Epos", "Drama", "Architektur"],
                coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
                quotes: [
                    { text: "Die Kathedrale war das Zentrum des Lebens, und ihr Bau war das größte Abenteuer.", page: 156 },
                    { text: "Ein Mensch, der keine Träume hat, ist wie ein Vogel ohne Flügel.", page: 423 },
                    { text: "Die Wahrheit ist wie ein Löwe. Du musst sie nicht verteidigen. Lass sie frei, und sie wird sich selbst verteidigen.", page: 789 }
                ],
                description: "Im mittelalterlichen England kämpft Prior Philip für den Bau einer gotischen Kathedrale. Eine fesselnde Saga über Macht, Liebe, Verrat und den unerschütterlichen Willen, etwas Großes zu schaffen.",
                pageCount: 1076,
                rating: 4.5
            }
        ];

        const insertBook = db.prepare(`
            INSERT INTO books (id, title, author, year, genre, subGenres, coverImage, quotes, description, pageCount, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const book of books) {
            insertBook.run(
                book.id,
                book.title,
                book.author,
                book.year,
                book.genre,
                JSON.stringify(book.subGenres),
                book.coverImage || null,
                JSON.stringify(book.quotes),
                book.description,
                book.pageCount,
                book.rating
            );
        }

        console.log(`✅ ${books.length} Bücher wurden hinzugefügt!`);
    }
};

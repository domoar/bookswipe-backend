import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';

const db = new Database('books.db');

console.log("Init db");
db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    cover TEXT,
    blurb TEXT
  )
`);

const count = db.query("SELECT COUNT(*) as total FROM books").get() as { total: number };

if (count.total === 0) {
  const insert = db.prepare("INSERT INTO books (title, author, cover, blurb) VALUES ($title, $author, $cover, $blurb)");
  
  const initialBooks = [
    { $title: "Der Alchimist", $author: "Paulo Coelho", $cover: "https://example.com/alchimist.jpg", $blurb: "Eine Reise zur Selbstfindung." },
    { $title: "Dune", $author: "Frank Herbert", $cover: "https://example.com/dune.jpg", $blurb: "Ein Epos auf einem Wüstenplaneten." },
    { $title: "1984", $author: "George Orwell", $cover: "https://example.com/1984.jpg", $blurb: "Dystopische Überwachung pur." }
  ];

  for (const book of initialBooks) {
    insert.run(book);
  }
}

const app = new Elysia()
  .get("/books", () => {
    return db.query("SELECT * FROM books").all();
  })
  .get("/books/:id", ({ params: { id } }) => {
    return db.query("SELECT * FROM books WHERE id = ?").get(id);
  })
  .post("/likes", ({ body }) => {
    console.log("Buch geliked:", body);
    return { status: "success" };
  }, {
    body: t.Object({
      bookId: t.Number(),
      userId: t.String()
    })
  })
  .listen(3001);

console.log(`Elysia running on http://localhost:3001`);
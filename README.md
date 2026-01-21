# Bookswipe-Backend

## Setup

Make any directory that suits you e.g. \projects\bookswipe. Change to that directory and run gh repo clone domoar/bookswipe-backend

Install bun via winget winget install bun. Confirm bun works with a new shell and command bun.

run 'bun install' to install dependencies.

run ' bun run .\src\index.ts' to start the api.

Test at <http://localhost:3001> e.g. <http://localhost:3001/books>.

## API Endpoints

Swipe-related:
- GET http://localhost:3001/swipe/next
- POST http://localhost:3001/swipe
- GET http://localhost:3001/matches/:userId

Books:
- GET http://localhost:3001/books

Users (CRUD):
- GET http://localhost:3001/users
- GET http://localhost:3001/users/:id
- POST http://localhost:3001/users
- PUT http://localhost:3001/users/:id
- DELETE http://localhost:3001/users/:id

Tags (CRUD):
- GET http://localhost:3001/tags
- GET http://localhost:3001/tags/:id
- POST http://localhost:3001/tags
- PUT http://localhost:3001/tags/:id
- DELETE http://localhost:3001/tags/:id

Snippets (CRUD):
- GET http://localhost:3001/snippets
- GET http://localhost:3001/snippets/:id
- POST http://localhost:3001/snippets
- PUT http://localhost:3001/snippets/:id
- DELETE http://localhost:3001/snippets/:id

Recommendations:
- GET http://localhost:3001/recommendations/:userId

Replace :id or :userId with actual user or resource IDs. POST and PUT requests require a JSON body with the relevant fields.

Let me know if you want example curl commands or request body samples!


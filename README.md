# Pantry Pages — Recipe App

React + Vite frontend with a `json-server` REST API for recipe data. Includes search, card list, detail view, and an add-recipe form that persists to the mock API. Test endpoints with Postman or curl.

## Quick start

```bash
npm install
npm run server    # starts json-server on http://localhost:4000
npm run dev       # starts Vite on http://localhost:5173
```

> Run `server` and `dev` in two terminals.

## API (json-server)

- Base URL: `http://localhost:4000`
- Collection: `/recipes`

Sample requests:

- List recipes: `GET http://localhost:4000/recipes`
- Filter by title: `GET http://localhost:4000/recipes?title_like=chicken`
- Create recipe: `POST http://localhost:4000/recipes`

Example body for POST:

```json
{
  "title": "Smoky Tofu Tacos",
  "cuisine": "Fusion",
  "time": "25 min",
  "difficulty": "Easy",
  "servings": 4,
  "tags": ["vegan", "weeknight"],
  "ingredients": ["tofu", "chipotle", "tortillas"],
  "instructions": "Marinate tofu, sear, warm tortillas, assemble."
}
```

## Frontend features

- Search recipes by title, cuisine, tags, or ingredients
- Card grid with time, difficulty, servings, and tags
- Detail panel showing ingredients and instructions
- Add-recipe form posts to `/recipes` and updates the UI

## Postman tips

- Create a collection with `GET /recipes` and `POST /recipes`
- Use `title_like` or `q` query params for quick text search
- Save environment variable `{{api_url}} = http://localhost:4000` for reuse
# Recipe-App

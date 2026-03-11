# Blog

A minimal, notebook‑styled personal blog built with Next.js and MongoDB.

## Quick Start

1. Install dependencies: `npm install`
2. Create `.env.local` with:
   - `MONGODB_URI=your_mongodb_connection_string`
   - `ADMIN_SECRET_KEY=your_admin_api_key`
3. Run the dev server: `npm run dev`

## API

`GET /api/posts` returns all posts sorted by date.

`POST /api/posts` creates a post (requires `x-api-key` header):

```json
{
  "title": "Post title",
  "content": "Markdown content",
  "slug": "post-title",
  "date": "2026-03-11T00:00:00.000Z"
}
```

## Notes

- Slugs must be kebab-case (e.g., `my-first-post`).
- Dates are optional; if omitted, the server uses the current time.

## Additional details

- A pen icon from `lucide-react` serves as the logo in the header; you can replace it with `public/logo.svg` if you prefer a custom image.
- Client-side fetch operations validate the response schema using Zod and report network or format errors.
- API routes include comprehensive validation (Zod schemas for input, Mongoose model requirements) and return proper HTTP status codes on failure.
- The post view component provides a **persistent, fixed back button** in the lower-left corner. Clicking it scrolls the viewport to the top before navigating back so readers don’t have to scroll manually when viewing long posts.

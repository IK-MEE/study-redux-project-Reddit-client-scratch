# Mini Reddit client

A minimal Reddit Client for browsing subreddits, posts, and comments.
Built to practice modern React, Redux Toolkit, and frontend testing.

---

## Features

- Browse posts by subreddit
- Search posts by title
- Toggle and view comments
- Responsive layout
- Skeleton loading states
- Error handling and recovery
- Keyboard-accessible UI

---

## Tech Stack

- React + Vite
- Redux Toolkit
- Reddit JSON API
- CSS
- Testing: Vitest, Testing Library, Cypress

---

## Testing

- Unit tests for Redux slices and core components
- End-to-end tests covering main user flows (Cypress)

---

```bash
npm test
npm run cy:open
```

---

## Notes
- Uses Reddit public JSON API (read-only)
- API requests are rate-limited
- Designed as learning and experimentation project
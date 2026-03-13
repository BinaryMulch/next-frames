# PocketBase Database Setup

This guide covers everything needed to set up the PocketBase backend for Next Frames from scratch.

## Quick Start

1. [Download PocketBase](https://pocketbase.io/docs/) for your platform
2. Run `./pocketbase serve` (starts on port 8090 by default)
3. Visit `http://127.0.0.1:8090/_/` and create an admin account
4. Create the `images` collection (see below)
5. Create a user account in the built-in `users` collection via the admin UI
6. Set your `.env.local`:
   ```
   NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
   ```
7. Run `npm run dev` and log in at `/login`

## Collections

### `users` (built-in auth collection)

PocketBase ships with this collection by default. No modifications are needed.

**Built-in fields used by the app:**
- `email` (string) — used for login
- `password` (string) — used for login

**How it's used:**
- `login.js` calls `pb.collection("users").authWithPassword(email, password)`
- `middleware.js` calls `pb.collection("users").authRefresh()` to validate sessions
- `imagesContext.js` reads `pb.authStore.record?.id` to check if a user is logged in
- `navbar.jsx` calls `pb.authStore.clear()` to sign out

**Setup:** Create at least one user account through the PocketBase admin UI (`/_/`).

---

### `images` (custom collection)

Create this collection manually in the PocketBase admin UI.

**Fields:**

| Field            | Type    | Required | Default | Notes                                      |
|------------------|---------|----------|---------|--------------------------------------------|
| `name`           | Text    | Yes      | —       | Image filename                             |
| `file`           | File    | Yes      | —       | Single file, max size ~50 MB               |
| `order_position` | Number  | Yes      | —       | Controls slideshow display order           |
| `is_paused`      | Bool    | No       | `false` | When `true`, image is hidden from slideshow|

**API Rules:**

| Action           | Rule                        | Reason                                   |
|------------------|-----------------------------|------------------------------------------|
| List             | *(empty — public)*          | `/slideshow` page fetches without auth   |
| View             | *(empty — public)*          | File URLs must be publicly accessible    |
| Create           | `@request.auth.id != ""`    | Only authenticated users can upload      |
| Update           | `@request.auth.id != ""`    | Only authenticated users can reorder/pause|
| Delete           | `@request.auth.id != ""`    | Only authenticated users can delete      |

**Sort and filter patterns used by the app:**

- `sort: "order_position"` — ascending order for display (used by `getAllImages.js`)
- `filter: "is_paused = false"` — slideshow excludes paused images (used by `getAllImages.js`)
- `filter: "order_position = ${n}"` — find adjacent image for reordering (used by `moveUpImage.js`, `moveDownImage.js`)

**File handling:**
- Files are attached to records via the `file` field on create
- Public file URLs are generated with `pb.files.getURL(record, record.file)`
- PocketBase automatically deletes attached files when a record is deleted

## Environment Setup

Only one environment variable is required. Create `.env.local` in the project root:

```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

This variable is read by:
- `utils/pocketbase/client.js` (browser-side PocketBase client)
- `utils/pocketbase/server.js` (server-side PocketBase client)
- `utils/pocketbase/middleware.js` (session validation)

## Authentication Details

The app uses cookie-based auth with these specifics:
- Cookie name: `pb_auth`
- Cookie path: `/`
- Cookie sameSite: `lax`
- `httpOnly: false` (so client-side JS can read auth state)

The middleware on `/dashboard` loads the cookie, validates it with `authRefresh()`, and redirects to `/login` if invalid.

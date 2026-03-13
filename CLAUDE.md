# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

Next Frames is a Next.js 15 application with React 19 that provides image slideshow management using PocketBase as the backend.

### Key Architecture Components

**App Structure (App Router)**:
- `/login` - PocketBase authentication page
- `/dashboard` - Protected image management interface
- `/slideshow` - Public slideshow display with auto-refresh every 5 minutes

**State Management**:
- React Context (`ImagesContext`) manages global image state and preview functionality
- Server Actions handle all PocketBase operations (upload, delete, reorder)

**Authentication Flow**:
- Middleware (`middleware.js`) protects `/dashboard` route
- Uses PocketBase JS SDK with cookie-based auth via `utils/pocketbase/`

**Image Management**:
- Server Actions in `app/actions/` for CRUD operations
- Components in `components/` for UI (image cards, upload, carousel)
- Images stored as file fields on PocketBase `images` collection records

### Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### PocketBase Collection Setup

Collection: `images`
- `name` (text, required)
- `file` (file, required, single file, max ~50MB)
- `order_position` (number, required)
- `is_paused` (bool, default false)

API rules: List/View = public (empty), Create/Update/Delete = `@request.auth.id != ""`

### Component Structure

- `ImageUploadCard` - Handles file uploads via server actions
- `ImageCardList` - Displays uploaded images with reorder/delete controls
- `Carousel` - Full-screen slideshow component
- `ImagePreview` - Dashboard preview pane

### Server Actions Pattern

All database operations use Next.js Server Actions:
- `getAllImages.js` - Fetches images ordered by position
- `uploadImage.js` - Handles file upload to PocketBase (file attached to record)
- `deleteImage.js` - Removes image record (PocketBase auto-deletes attached files)
- `moveUpImage.js/moveDownImage.js` - Reorders images
- `toggleImagePause.js` - Toggles image visibility in slideshow

### Styling

Uses Tailwind CSS v4 with CSS-first configuration in `app/globals.css` (no `tailwind.config.mjs`). Custom theme tokens (primary color palette, fonts, screen-dynamic height) and class-based dark mode are defined via `@theme` and `@variant` directives. PostCSS uses `@tailwindcss/postcss`.

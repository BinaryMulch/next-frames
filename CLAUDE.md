# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

Next Frames is a Next.js 15 application with React 19 that provides image slideshow management using Supabase as the backend.

### Key Architecture Components

**App Structure (App Router)**:
- `/login` - Supabase authentication page
- `/dashboard` - Protected image management interface 
- `/slideshow` - Public slideshow display with auto-refresh every 5 minutes

**State Management**:
- React Context (`ImagesContext`) manages global image state and preview functionality
- Server Actions handle all Supabase operations (upload, delete, reorder)

**Authentication Flow**:
- Middleware (`middleware.js`) protects `/dashboard` route
- Uses Supabase SSR with server/client utilities in `utils/supabase/`

**Image Management**:
- Server Actions in `app/actions/` for CRUD operations
- Components in `components/` for UI (image cards, upload, carousel)
- Images stored in Supabase storage with URLs in database

### Environment Setup

Required environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Component Structure

- `ImageUploadCard` - Handles file uploads via server actions
- `ImageCardList` - Displays uploaded images with reorder/delete controls
- `Carousel` - Full-screen slideshow component
- `ImagePreview` - Dashboard preview pane

### Server Actions Pattern

All database operations use Next.js Server Actions:
- `getAllImages.js` - Fetches images ordered by position
- `uploadImage.js` - Handles file upload to Supabase storage
- `deleteImage.js` - Removes image and file
- `moveUpImage.js/moveDownImage.js` - Reorders images

### Styling

Uses Tailwind CSS with custom configuration for responsive design and full-height layouts.
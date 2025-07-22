# PocketBase Schema Documentation

This document describes how to set up the PocketBase collections required for the Next Frames application.

## Prerequisites

1. Install PocketBase on your server
2. Start PocketBase: `./pocketbase serve`
3. Access the admin panel at `http://your-domain:8090/_/` (or localhost:8090 for local development)

## Collections Setup

### 1. Users Collection

The `users` collection is created automatically by PocketBase. You only need to configure authentication settings.

**Authentication Settings:**
- Enable email/password authentication
- Configure email verification if desired
- Set password requirements as needed

### 2. Images Collection

Create a new collection named `images` with the following configuration:

**Collection Settings:**
- **Name:** `images`
- **Type:** Base collection
- **List/Search rule:** `@request.auth.id != ""` (authenticated users only)
- **View rule:** `""` (public - allows slideshow access)
- **Create rule:** `@request.auth.id != ""`
- **Update rule:** `@request.auth.id != ""`
- **Delete rule:** `@request.auth.id != ""`

**Schema Fields:**

| Field Name | Type | Options | Required | Unique |
|------------|------|---------|----------|--------|
| `name` | Text | Max length: 255 | ✓ | ✗ |
| `image` | File | Max select: 1, Max size: 10MB, MIME types: image/* | ✓ | ✗ |
| `order_position` | Number | Min: 0 | ✓ | ✗ |

**Indexes:**
- Create an index on `order_position` for better query performance

### Field Details

#### `name` Field
- **Type:** Text
- **Purpose:** Stores the original filename or display name
- **Validation:** Required, max 255 characters

#### `image` Field
- **Type:** File
- **Purpose:** Stores the actual image file
- **Settings:**
  - Max select: 1 (single file)
  - Max size: 10MB (adjust as needed)
  - MIME types: `image/*` (accepts all image formats)
- **Validation:** Required

#### `order_position` Field
- **Type:** Number
- **Purpose:** Determines the display order in slideshows
- **Settings:**
  - Min value: 0
- **Validation:** Required

## API Rules Explanation

### List/Search Rule: `@request.auth.id != ""`
- Only authenticated users can list/search images
- Used by the admin interface

### View Rule: `""` (empty = public)
- Allows public access to individual image records
- Enables the slideshow page to work without authentication
- File URLs are also publicly accessible

### Create/Update/Delete Rules: `@request.auth.id != ""`
- Only authenticated users can modify images
- Protects against unauthorized uploads/changes

## Environment Variables

Add these environment variables to your `.env.local` file:

```
NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
# For production, use your actual PocketBase server URL:
# NEXT_PUBLIC_POCKETBASE_URL=https://your-pocketbase-domain.com
```

## File Storage

PocketBase automatically handles file storage and generates URLs in the format:
```
http://your-domain:8090/api/files/{collectionId}/{recordId}/{filename}
```

Files are stored in the `pb_data/storage` directory on your server.

## Migration from Supabase

If migrating from Supabase, you'll need to:

1. Export your existing image data
2. Download all stored images
3. Create records in PocketBase using the API or admin interface
4. Upload images to the corresponding records

## Backup Recommendations

- Regularly backup the entire `pb_data` directory
- This includes the database and all uploaded files
- Consider automated backup scripts for production

## Security Notes

- The view rule is intentionally public to support slideshow functionality
- All modification operations require authentication
- File uploads are restricted to authenticated users only
- Consider implementing rate limiting at the server level
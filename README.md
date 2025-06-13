# Next Frames

Next Frames is a web-based image slideshow manager built with Next.js and Supabase. It lets you upload images and play them back in a full-screen slideshow.

## Features
- Login via Supabase authentication
- Dashboard to upload, preview and delete images
- Automatic slideshow cycling through uploaded pictures
- Built with Next.js 15, React 19 and Tailwind CSS

## Prerequisites
- Node.js
- A Supabase project

### Environment Variables
Create a `.env.local` file and add the following keys:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## Setup
1. Clone the repository
   ```bash
   git clone <repo_url>
   cd next-frames
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create `.env.local` with your keys as shown above
4. Run the development server
   ```bash
   npm run dev
   ```

## Production
Create an optimized build and start the app:
```bash
npm run build
npm start
```

## Launching the Slideshow
After starting the server, open `/slideshow` in your browser to view the slideshow.

## License
Released under the [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/) license.

# 🖼️ Next Frames

A modern, high-performance image slideshow management system built with Next.js 15 and Supabase. Create, manage, and display beautiful image slideshows with real-time updates and optimistic UI interactions.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

### 🎯 Core Functionality
- **🔐 Secure Authentication** - Supabase-powered user authentication with protected routes
- **📱 Responsive Dashboard** - Modern, beautiful interface for image management
- **🖼️ Smart Image Upload** - Drag & drop or click to upload with file validation
- **🎢 Dynamic Slideshow** - Auto-cycling full-screen slideshow with smooth transitions
- **👀 Real-time Preview** - Instant image preview with loading states
- **🔄 Drag to Reorder** - Intuitive image reordering with optimistic updates

### ⚡ Performance & UX
- **🚀 Optimistic Updates** - Instant UI feedback for all operations
- **🔒 Multi-user Conflict Prevention** - Smart locking system prevents data conflicts
- **📊 Memoized Components** - Optimized React components for smooth performance
- **🏃‍♂️ Queue-based Operations** - Sequential server actions prevent race conditions
- **🎨 Beautiful UI** - Polished interface with hover effects and animations

### 🛡️ Technical Excellence
- **📦 Modern Stack** - Next.js 15 with React 19 and App Router
- **🎯 TypeScript Ready** - Full type safety support
- **♿ Accessible** - WCAG compliant with proper ARIA labels
- **📱 Mobile First** - Responsive design that works on all devices
- **🔧 Performance Optimized** - Lazy loading, memoization, and efficient re-renders

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase project with storage bucket configured
- Modern browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/next-frames.git
   cd next-frames
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Create the following table in your Supabase database:
   ```sql
   CREATE TABLE images (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     name text NOT NULL,
     url text NOT NULL,
     storage_id text NOT NULL,
     order_position integer NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   ```

5. **Storage Setup**
   
   Create a storage bucket named `images` in your Supabase dashboard with public access.

6. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### Dashboard (`/dashboard`)
- **Upload Images**: Drag & drop or click to select multiple images
- **Reorder Images**: Use up/down arrows to change slideshow sequence  
- **Preview Images**: Click preview button to see full-size image
- **Delete Images**: Remove unwanted images from your slideshow
- **Real-time Updates**: Changes are reflected immediately across all views

### Slideshow (`/slideshow`)
- **Auto-cycling**: Images transition every 5 seconds automatically
- **Full-screen Display**: Optimized for presentation and digital signage
- **Smooth Transitions**: CSS-powered slide animations
- **Auto-refresh**: Checks for new images every 5 minutes

## 🏗️ Project Structure

```
next-frames/
├── app/
│   ├── actions/           # Server Actions for CRUD operations
│   ├── context/          # React Context for state management
│   ├── dashboard/        # Protected dashboard pages
│   ├── login/           # Authentication pages  
│   └── slideshow/       # Public slideshow display
├── components/          # Reusable React components
├── utils/              # Utility functions and Supabase clients
└── middleware.js       # Next.js middleware for route protection
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TailwindCSS
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Context with optimistic updates
- **Performance**: React.memo, useMemo, useCallback optimization
- **Icons**: React Icons (Font Awesome)
- **Notifications**: React Toastify

## 🔧 Configuration

### Image Upload Limits
- **Max file size**: 5MB per image
- **Max total upload**: 50MB per batch
- **Supported formats**: JPG, PNG, GIF, SVG

### Auto-refresh Intervals
- **Slideshow**: Checks for new images every 5 minutes
- **Dashboard**: Real-time updates via optimistic UI
- **User activity**: Heartbeat every 5 seconds

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues & Limitations

- **Multi-browser sessions**: Same user across different browsers may not detect conflicts
- **Large images**: Very large images may cause slower loading times
- **Concurrent uploads**: Multiple simultaneous uploads may conflict

## 📝 Changelog

### v0.2.0
- ✅ Added optimistic UI updates for move operations
- ✅ Implemented multi-user conflict prevention
- ✅ Enhanced UI with better loading states and animations
- ✅ Performance optimizations with React.memo and useMemo
- ✅ Improved image handling with Next.js Image component

### v0.1.0
- ✅ Initial release with core functionality
- ✅ Supabase authentication and storage integration
- ✅ Basic dashboard and slideshow features

## 📄 License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/) License.

## 🙋‍♂️ Support

- **Documentation**: Check the [CLAUDE.md](./CLAUDE.md) file for development guidance
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join project discussions in GitHub Discussions

---

<div align="center">
  <strong>Built with ❤️ using Next.js and Supabase</strong>
</div>
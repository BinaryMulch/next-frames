# Next Frames

A modern, enterprise-grade image slideshow management system built with Next.js 15 and Supabase. Create, manage, and display professional image slideshows with real-time updates, theme customization, and advanced UI optimization.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)
![Version](https://img.shields.io/badge/Version-0.3.0-brightgreen?style=flat-square)

## Features

### Core Functionality
- **Enterprise Authentication**: Supabase-powered secure authentication with protected routes
- **Responsive Dashboard**: Professional interface with adaptive design for all devices
- **Advanced Image Management**: Drag & drop upload with comprehensive file validation
- **Dynamic Slideshow**: Auto-cycling full-screen display with smooth transitions
- **Real-time Preview**: Instant image preview with optimized loading states
- **Intelligent Reordering**: Drag-to-reorder functionality with optimistic updates

### User Experience
- **Light/Dark Theme Toggle**: Professional theme switching with localStorage persistence
- **Optimistic Updates**: Instant UI feedback for all user operations
- **Multi-user Conflict Prevention**: Advanced locking system prevents concurrent editing conflicts
- **Performance Optimization**: Memoized components and efficient rendering patterns
- **Queue-based Operations**: Sequential server actions prevent race conditions
- **Polished Interface**: Professional design with smooth animations and hover effects

### Technical Excellence
- **Modern Architecture**: Next.js 15 with React 19 and App Router pattern
- **Type-Safe Development**: Full TypeScript compatibility and type safety
- **Accessibility Compliance**: WCAG 2.1 compliant with proper ARIA implementation
- **Mobile-First Design**: Responsive layouts optimized for all screen sizes
- **Production Ready**: Enterprise-grade performance optimizations and error handling

## Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- A Supabase project with storage bucket configured
- Modern browser with ES2020 support

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/next-frames.git
   cd next-frames
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Schema Setup**
   
   Execute the following SQL in your Supabase SQL editor:
   ```sql
   CREATE TABLE images (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     name text NOT NULL,
     url text NOT NULL,
     storage_id text NOT NULL,
     order_position integer NOT NULL,
     created_at timestamptz DEFAULT now()
   );
   
   -- Create indexes for optimal performance
   CREATE INDEX idx_images_order_position ON images(order_position);
   CREATE INDEX idx_images_created_at ON images(created_at);
   ```

5. **Storage Configuration**
   
   Create a storage bucket named `images` in your Supabase dashboard:
   - Set bucket to **public** access
   - Configure upload limits as needed
   - Enable file type restrictions (JPG, PNG, GIF, SVG)

6. **Launch Development Environment**
   ```bash
   npm run dev
   ```

   Navigate to [http://localhost:3000](http://localhost:3000) to access the application.

## User Guide

### Dashboard Interface (`/dashboard`)
- **Upload Management**: Multi-file drag & drop upload with real-time progress
- **Image Reordering**: Intuitive up/down controls for slideshow sequencing
- **Preview System**: Full-size image preview with loading optimization
- **Deletion Control**: Safe image removal with confirmation prompts
- **Theme Customization**: Light/dark mode toggle with system preference detection
- **Real-time Synchronization**: Instant updates across all connected sessions

### Slideshow Display (`/slideshow`)
- **Automated Cycling**: Configurable image transitions (default: 10 seconds)
- **Full-screen Presentation**: Optimized for digital signage and presentations
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Dynamic Updates**: Automatic content refresh every 5 minutes
- **Responsive Scaling**: Adaptive image sizing for various display ratios

## Architecture Overview

```
next-frames/
├── app/
│   ├── actions/           # Server Actions for database operations
│   ├── context/          # React Context providers (Images, Theme)
│   ├── dashboard/        # Protected dashboard interface
│   ├── login/           # Authentication interface
│   └── slideshow/       # Public slideshow display
├── components/          # Modular React components
├── utils/              # Utility functions and Supabase configuration
└── middleware.js       # Route protection and authentication
```

### Key Design Patterns
- **Server Actions**: Modern data fetching with automatic revalidation
- **Context Architecture**: Centralized state management with optimistic updates
- **Component Composition**: Reusable, memoized components for optimal performance
- **Theme System**: Centralized theme management with localStorage persistence

## Development Workflow

### Available Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Generate production build with optimizations
npm run start    # Start production server
npm run lint     # Execute ESLint code quality checks
```

### Technology Stack

- **Framework**: Next.js 15.3.3 with App Router architecture
- **Frontend**: React 19.0.0, TailwindCSS 3.4.1
- **Backend Services**: Supabase (Authentication, Database, Storage)
- **State Management**: React Context with optimistic update patterns
- **Performance**: React.memo, useMemo, useCallback optimization strategies
- **UI Components**: React Icons, Headless UI
- **Notifications**: React Toastify with custom styling

## Configuration Options

### Upload Specifications
- **Maximum file size**: 5MB per individual image
- **Maximum batch size**: 50MB per upload session
- **Supported formats**: JPEG, PNG, GIF, SVG
- **Processing**: Automatic optimization and validation

### System Intervals
- **Slideshow transitions**: 10 seconds between images
- **Content refresh**: 5-minute intervals for new content detection
- **User activity monitoring**: 5-second heartbeat for conflict prevention
- **Session management**: 15-second timeout for inactive sessions

### Theme System
- **Storage**: Browser localStorage with fallback to system preferences
- **Modes**: Professional light and dark themes
- **Persistence**: Cross-session theme retention
- **Transitions**: Smooth 200ms duration animations

## Deployment Guide

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Enable automatic deployments on push
4. Monitor performance with Vercel Analytics

### Docker Containerization
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Contributing Guidelines

1. Fork the repository and create a feature branch
2. Implement changes with appropriate test coverage
3. Follow established code style and conventions
4. Document new features and API changes
5. Submit a pull request with detailed description

### Development Standards
- Use TypeScript for type safety
- Follow React best practices and hooks guidelines
- Implement proper error handling and loading states
- Write comprehensive commit messages
- Test functionality across different browsers

## Known Limitations

- **Cross-browser sessions**: Multi-device conflict detection limited to localStorage scope
- **Large file handling**: Images exceeding 5MB require manual optimization
- **Concurrent operations**: Heavy simultaneous usage may require rate limiting
- **Mobile upload**: Some mobile browsers have file selection limitations

## Version History

### v0.3.0 - Theme System Release
- Implemented comprehensive light/dark theme system
- Added theme toggle with localStorage persistence
- Enhanced UI consistency across all components
- Improved accessibility with better contrast ratios
- Updated navigation and button visibility for dark mode

### v0.2.0 - Performance Enhancement
- Introduced optimistic UI updates for improved responsiveness
- Implemented multi-user conflict prevention system
- Enhanced interface with professional loading states
- Optimized performance with React memoization strategies
- Improved image handling with Next.js Image component

### v0.1.0 - Initial Release
- Core slideshow management functionality
- Supabase authentication and storage integration
- Basic dashboard and presentation interfaces

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/) License. Commercial usage requires explicit permission.

## Additional Resources

- **Technical Documentation**: Comprehensive development guidelines available in project documentation
- **Issue Tracking**: Report bugs via GitHub Issues
- **Feature Requests**: Submit enhancement proposals through GitHub Discussions
- **Security**: Report security vulnerabilities privately via GitHub Security

---

<div align="center">
  <strong>Professional slideshow management solution powered by modern web technologies</strong><br>
  <em>Next.js 15 • React 19 • Supabase • TailwindCSS</em>
</div>
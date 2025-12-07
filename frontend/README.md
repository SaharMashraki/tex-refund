# Tax Refund Platform - Frontend

A modern, bilingual (English/Hebrew) web application for calculating tax refunds, built with Nuxt 3, Vue 3, and TailwindCSS.

## Features

✨ **Premium Dark Mode Theme** - Beautiful dark mode by default with smooth light mode toggle  
🌍 **Bilingual Support** - Full English and Hebrew support with automatic RTL layout switching  
🔐 **Authentication** - JWT-based auth with secure token management  
📝 **Multi-Step Form Wizard** - 10-step guided form for tax refund calculation  
📄 **Document Management** - Upload, tag, and manage tax documents  
💳 **Payment Integration** - Stripe integration for premium features  
🎨 **Modern UI** - Glassmorphism effects, micro-animations, and responsive design  
♿ **Accessible** - WCAG 2.1 AA compliant with keyboard navigation support

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3 Composition API)
- **Styling**: TailwindCSS v3 with custom dark mode theme
- **State Management**: Pinia
- **i18n**: vue-i18n for static text + backend-driven dynamic tags
- **HTTP Client**: Axios with interceptors
- **TypeScript**: Full type safety
- **Utilities**: VueUse composables

## Getting Started

### Prerequisites

- Node.js v18+ (LTS recommended)
- npm or yarn
- Backend server running on `http://localhost:3000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the frontend directory:
   ```env
   NUXT_PUBLIC_API_BASE=http://localhost:3000/api/v1
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## Key Features

### Authentication

- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh
- Protected routes with middleware

### Form Wizard

- 10-step guided form
- Auto-save with debouncing (1 second)
- Step validation
- Progress tracking

### Document Management

- Drag-and-drop file upload
- File type and size validation
- Upload progress tracking
- Bilingual tag display

### Theme System

- Dark mode by default
- Smooth transitions between themes
- System preference detection
- Persistent user preference

## License

Proprietary - All rights reserved

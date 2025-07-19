# Rémi Guillette Groupe - Professional Consulting Website

## Overview

This is a modern, bilingual (French/English) professional consulting website for Rémi Guillette Groupe, a Canadian consulting firm specializing in public safety, francophone community services, occupational health & safety, and animal first aid services. The application is built with a React frontend and Express backend, designed with a dark theme using a black/orange/blue color palette and full mobile responsiveness.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with custom design system
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Internationalization**: Custom i18n hook with JSON translation files

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: Configured for PostgreSQL with Drizzle ORM
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Design System
- **Theme**: Dark-first design with CSS custom properties
- **Colors**: Black (#1a1625), Orange (#f89422), Blue (#3b82f6) palette
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: AODA compliance considerations
- **French Language Rule**: Main page is in French, first word of each sentence/title is always blue, remaining text is orange
- **Card Design**: Division cards use black background with orange outline, orange icons without background
- **Division Page Card Titles**: Service card titles on all division pages have first word in blue (#3b82f6), remaining text in orange (#f89422)

## Key Components

### Frontend Components
- **Layout**: Main layout with navigation, language switcher, and responsive mobile menu
- **Pages**: Home, Divisions, Services, Contact with smooth scrolling navigation
- **Language System**: React Context-based bilingual support with persistent language preference and global state management
- **Translation Context**: TranslationProvider manages language state across all components
- **UI Library**: Complete Shadcn/ui component set including forms, dialogs, toasts

### Backend Components
- **Routes**: RESTful API structure with `/api` prefix
- **Storage**: Abstracted storage interface with in-memory implementation
- **User Management**: Basic user schema with authentication support
- **Logging**: Request/response logging middleware

### Database Schema
- **Users Table**: Basic user management with username/password
- **Extensible**: Drizzle schema setup for easy table additions

## Data Flow

### Frontend Data Flow
1. User interactions trigger React state updates
2. API calls managed through TanStack Query for caching and synchronization
3. Language changes persist to localStorage and update document language
4. Form submissions use controlled components with validation

### Backend Data Flow
1. Express middleware handles CORS, parsing, and logging
2. Routes process API requests and interact with storage layer
3. Storage abstraction allows switching between in-memory and database storage
4. Responses formatted consistently with error handling

### Internationalization Flow
1. Language preference stored in localStorage and managed via React Context
2. TranslationProvider context manages global language state across all components
3. JSON translation files for French and English (Canadian) with conditional rendering for hero content
4. Document language attribute updates dynamically
5. Hero section uses conditional rendering to preserve original French content while providing English translations

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, TanStack Query
- **UI/Styling**: TailwindCSS, Radix UI, Lucide React icons
- **Backend**: Express, Drizzle ORM, PostgreSQL drivers
- **Development**: Vite, TypeScript, ESBuild
- **Security**: react-google-recaptcha for form spam protection

### Database Integration
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon Database serverless driver
- **Migrations**: Drizzle Kit for schema management

### Build Tools
- **Frontend**: Vite with React plugin and runtime error overlay
- **Backend**: ESBuild for production bundling
- **Development**: TSX for TypeScript execution

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: Node.js with TSX for TypeScript execution
- **Database**: Environment variable configuration for DATABASE_URL

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server to `dist` directory
- **Static Serving**: Express serves frontend build in production

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Development**: Replit-specific development features and error handling
- **Build**: Separate development and production build processes
- **Security**: reCAPTCHA integration requires RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY environment variables

### Key Features
- Bilingual Canadian content (French primary, English secondary)
- Four distinct service divisions with detailed descriptions
- Contact form with validation and success feedback
- Responsive navigation with smooth scrolling
- Dark theme with professional branding
- AODA accessibility compliance considerations
- Division cards in hero section with French titles (first word blue, rest orange)
- Orange icons without background, black cards with orange outline
- Global language state management via React Context
- Conditional rendering for hero content to preserve French styling while providing English translations
- Language toggle button showing target language (EN when French active, FR when English active)

### Recent Changes (July 2025)
- **reCAPTCHA Integration** (July 17, 2025): Added spam protection to contact form
  - Integrated react-google-recaptcha library with dark theme matching website design
  - Added backend reCAPTCHA verification using Google's API
  - Implemented graceful fallback when reCAPTCHA keys are not configured
  - Protected contact form submissions against spam and bot attacks
  - Added conditional rendering and validation based on reCAPTCHA availability
  - Environment variables: RECAPTCHA_SITE_KEY and RECAPTCHA_SECRET_KEY required for activation
- **Contact Form Translation Fix** (July 17, 2025): Resolved missing English translations
  - Fixed hardcoded French labels for "Address", "Phone", "Email" fields
  - Updated form input placeholders to use proper translation keys
  - Added service dropdown options with bilingual support
  - Enhanced translation structure with new label and service sections
- **Footer Contact Link** (July 17, 2025): Added navigation link to contact page
  - Added contact link above privacy policy link in footer navigation
  - Uses consistent styling and localization with existing footer elements
- **Dynamic Sitemap & SEO Fix** (July 17, 2025): Resolved Google indexing sitemap error
  - Fixed sitemap.xml with dynamic domain resolution instead of hardcoded placeholder URLs
  - Added server-side sitemap generation that adapts to current domain automatically
  - Implemented dynamic robots.txt generation with proper sitemap references
  - Added SEO health check endpoint `/api/seo-health` for monitoring
  - Updated sitemap with current date and proper XML formatting
  - Fixed "Google index sitemap missing error" by ensuring proper domain URLs
  - Maintained all existing SEO features: meta tags, Google verification, multilingual support
- **Discord Webhook Integration** (July 17, 2025): Connected contact form to Discord notifications
  - Added Discord webhook function to server routes with rich embed formatting
  - Configured automatic sending of contact form submissions to Discord channel
  - Implemented error handling to prevent form submission failures
  - Added proper French service name mapping for Discord messages
  - Formatted messages with orange color theme and organized fields
  - Successfully tested and verified Discord integration working
- **BeaverTalk Chat Widget Removal** (July 17, 2025): Complete cleanup of failed chat integration
  - Removed BeaverTalkWidget component and all related files
  - Cleaned up API proxy routes from server
  - Removed chat-related database schemas and storage functions
  - Removed chat translations from locale files
  - Removed chat type definitions from i18n.ts
  - Project restored to clean state without any chat functionality references
- **Migration to Replit Environment** (July 17, 2025): Successfully migrated project from Replit Agent to standard Replit environment
  - All packages and dependencies properly installed and configured
  - Express server running on port 5000 with Vite development integration
  - Security headers, CORS, and production optimizations maintained
  - Full functionality verified including bilingual support and all features
  - Project now ready for continued development and deployment
- **Translation System Overhaul**: Converted from individual component hooks to React Context-based global state management
- **Language Toggle Fix**: Fixed toggle button to show target language instead of current language
- **Hero Section Localization**: Implemented conditional rendering to maintain French content integrity while providing English translations
- **State Synchronization**: Resolved language switching issues across all components using shared TranslationProvider context
- **Division Pages Enhancement**: Created dedicated pages for all four divisions:
  - Public Safety Consulting (`/public-safety`)
  - Francophone Community Services (`/francophone-services`)
  - Occupational Health & Safety (`/health-safety`)
  - Animal First Aid Services (`/animal-first-aid`)
- **Interactive Hero Cards**: Made all division cards in hero section clickable with routing to dedicated pages
- **Consistent Design Pattern**: All division pages follow same design structure with service grids and bilingual content
- **Division Page Card Title Styling**: Applied blue (#3b82f6) first word styling to all service card titles across all division pages (July 10, 2025)
- **Privacy Policy Implementation**: Created comprehensive PIPEDA-compliant privacy policy page with bilingual support (`/privacy-policy` and `/politique-confidentialite`)
- **Footer Navigation Fix**: Resolved duplicate privacy policy links in footer to show single dynamic link based on language
- **Cookie Consent Popup**: Implemented GDPR/PIPEDA-compliant cookie consent modal with detailed cookie information, matching privacy policy design styling
- **Production Deployment Preparation**: Comprehensive deployment optimizations including:
  - Security headers and CORS configuration
  - Gzip compression for all responses
  - Production error handling with sanitized logging
  - SEO optimization with meta tags, sitemap, and robots.txt
  - PWA manifest and favicon configuration
  - Performance optimizations with asset caching
  - Complete deployment guide and checklist created
- **BeaverTalk Chat Widget Production Integration** (July 12, 2025): **FAILED AND ABORTED**
  - This feature has been determined to be non-viable and has been completely removed from the project
  - All chat widget components, API proxy routes, and related schemas have been cleaned up
  - The chat functionality could not be successfully integrated with the BeaverTalk API
  - Project has been restored to pre-chat widget state with all references removed
- **Footer Media & SEO Structured Data Fix** (July 19, 2025): Resolved social media SEO detection issues
  - Added comprehensive Schema.org JSON-LD structured data to index.html head section
  - Implemented Organization schema with official social media profile mapping using `sameAs` property
  - Cleaned up Instagram URL by removing tracking parameters (igsh query string)
  - Added contact information, address, and business details to structured data
  - Updated SEO health check endpoint to reflect structured data implementation
  - All social media links tested and verified working correctly
  - Fixed SEO tools' inability to detect official social media profiles with machine-readable markup
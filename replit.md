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
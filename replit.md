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
- **Colors**: Black (#1a1625), Orange (#ff6b35), Blue (#3b82f6) palette
- **Typography**: Inter font family
- **Responsive**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: AODA compliance considerations

## Key Components

### Frontend Components
- **Layout**: Main layout with navigation, language switcher, and responsive mobile menu
- **Pages**: Home, Divisions, Services, Contact with smooth scrolling navigation
- **Language System**: Bilingual support with persistent language preference
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
1. Language preference stored in localStorage
2. Custom hook provides translation function and language switching
3. JSON translation files for French and English (Canadian)
4. Document language attribute updates dynamically

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
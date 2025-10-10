# Rémi Guillette Groupe - Professional Consulting Website

## Overview
This project is a modern, bilingual (French/English) professional consulting website for Rémi Guillette Groupe, a Canadian firm specializing in public safety, francophone community services, occupational health & safety, and animal first aid. The application aims to provide a robust online presence, showcasing services, and enabling client interaction. It is designed with a dark theme and full mobile responsiveness, focusing on accessibility and Canadian legal compliance (PIPEDA, AODA). The business vision is to expand reach and provide accessible information on their diverse consulting services.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite.
- **Routing**: Wouter.
- **Styling**: TailwindCSS with custom design system, Shadcn/ui component library, and Radix UI primitives.
- **State Management**: TanStack Query for server state.
- **Internationalization**: Custom i18n hook with JSON translation files; React Context-based global state for language.
- **UI/UX**: Dark-first theme (black, orange, blue palette), Inter font, mobile-first responsive design.
- **Accessibility**: AODA compliance (WCAG 2.1 AA), comprehensive screen reader optimization for icons.
- **Design Elements**: Main page in French with first word of sentences/titles in blue, rest in orange. Division cards are black with orange outline and orange icons. Service card titles on division pages have the first word in blue, rest in orange.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database**: SQLite with Drizzle ORM.
- **Session Management**: Connect-pg-simple.
- **API**: RESTful structure with `/api` prefix.
- **Storage**: Abstracted storage interface.
- **Security**: IP-based rate limiting and content validation for contact form.

### Core Features
- Bilingual content (French primary, English secondary).
- Four distinct service divisions with dedicated pages and interactive hero cards.
- Contact form with validation, success feedback, and Discord webhook integration for notifications.
- Responsive navigation with smooth scrolling.
- PIPEDA-compliant privacy policy and cookie consent modal.
- Dynamic sitemap and comprehensive SEO optimization with Schema.org JSON-LD structured data (Organization, ProfessionalService, Local Business schemas).
- Automatic scroll to top on navigation.
- PWA configuration.
- Secure professional card route protected by a 4-digit PIN backed by SQLite storage.

## Secure Professional Card Access
- Route: `/card` (SPA page) guarded by a 4-digit PIN challenge.
- Default PIN: `4281`. Override by setting the `CARD_ROUTE_PIN` environment variable before starting the server.
- Verification Endpoint: `POST /api/card/access` with JSON body `{ "pin": "1234" }`.
- PINs are hashed with SHA-256 and stored in the `protected_routes` SQLite table. The hash updates automatically when the env var changes.
- Successful verification returns the bilingual digital business card for Rémi Guillette, including mission, expertise, contact information, and availability.

## External Dependencies
- **React Ecosystem**: React, React DOM, TanStack Query.
- **UI/Styling**: TailwindCSS, Radix UI, Lucide React icons.
- **Backend**: Express, Drizzle ORM, SQLite drivers.
- **Development**: Vite, TypeScript, ESBuild, TSX.
- **Database Connection**: Better SQLite3 native driver.
- **Migrations**: Drizzle Kit.
- **Communication**: Discord (for contact form notifications).

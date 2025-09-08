# Rémi Guillette Groupe - Professional Consulting Website

## Overview

This project is a modern, bilingual (French/English) professional consulting website for Rémi Guillette Groupe, a Canadian firm specializing in public safety, francophone community services, occupational health & safety, and animal first aid services. The site aims to provide a professional online presence, showcasing the firm's diverse service offerings and facilitating client engagement. It's built with a focus on accessibility (AODA compliant), responsiveness, and a distinct dark-themed aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for client-side navigation.
- **Styling**: TailwindCSS with a custom design system, utilizing Shadcn/ui and Radix UI components.
- **State Management**: TanStack Query for server state.
- **Internationalization**: Custom i18n hook with JSON translation files, using React Context for global state management.
- **Design**: Dark theme (black, orange, blue palette), Inter font, mobile-first responsive design.
- **Accessibility**: WCAG 2.1 AA compliant, with specific attention to icon accessibility and screen reader support.
- **Language Specifics**: Main page and hero section content prioritize French with conditional rendering for English. Division card titles use a specific blue/orange color scheme for French text.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **Database**: Configured for PostgreSQL with Drizzle ORM.
- **Session Management**: Connect-pg-simple for PostgreSQL.
- **API**: RESTful structure (`/api` prefix).
- **Security**: IP-based rate limiting and content validation for contact form.
- **Integrations**: Discord webhook for contact form submissions.

### Core Features
- Bilingual content (French primary, English secondary).
- Four distinct service divisions with dedicated pages and interactive hero cards.
- Contact form with validation and Discord integration.
- Responsive navigation and smooth scrolling.
- PWA (Progressive Web App) configuration.
- Comprehensive SEO including dynamic sitemap, robots.txt, and Schema.org JSON-LD structured data (Organization, ProfessionalService).
- PIPEDA-compliant privacy policy and cookie consent management.

## External Dependencies

- **React Ecosystem**: React, React DOM, TanStack Query.
- **UI/Styling**: TailwindCSS, Radix UI, Lucide React icons.
- **Backend**: Express, Drizzle ORM, PostgreSQL drivers (e.g., Neon Database serverless driver).
- **Development & Build**: Vite, TypeScript, ESBuild, TSX.
- **Database Tools**: Drizzle Kit for schema migrations.
- **Communication**: Discord (via webhooks for contact form).
# Rémi Guillette Groupe - Professional Consulting Website

## Overview

This project is a modern, bilingual (French/English) professional consulting website for Rémi Guillette Groupe, a Canadian firm specializing in public safety, francophone community services, occupational health & safety, and animal first aid services. The site is designed with a dark theme using a black/orange/blue color palette, emphasizing full mobile responsiveness and AODA compliance. Its purpose is to showcase the firm's services, provide contact information, and establish a professional online presence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter for lightweight client-side navigation.
- **Styling**: TailwindCSS with a custom design system, utilizing Shadcn/ui and Radix UI.
- **State Management**: TanStack Query for server state.
- **Internationalization**: Custom i18n hook with JSON files, persistent language preference via React Context.
- **Design**: Dark-first theme with `black (#1a1625)`, `orange (#f89422)`, and `blue (#3b82f6)` palette. Inter font family. Mobile-first responsive design.
- **Accessibility**: WCAG 2.1 AA compliant, with specific attention to icon accessibility and ARIA attributes.
- **UI/UX**: Main page in French, with specific color rules for text (first word blue, rest orange) for titles and division cards. Division cards have a black background, orange outline, and orange icons without background.

### Backend
- **Runtime**: Node.js with Express.js (TypeScript, ES modules).
- **Database**: PostgreSQL with Drizzle ORM; connect-pg-simple for session management.
- **API**: RESTful API under `/api` prefix.
- **Storage**: Abstracted storage interface.
- **Security**: IP-based rate limiting and content validation for contact forms.
- **SEO**: Dynamic sitemap and robots.txt generation, comprehensive Schema.org JSON-LD structured data (Organization, ProfessionalService, Local Business schemas).

### Key Features
- Bilingual content (French primary, English secondary).
- Four distinct service "Secteurs d'activité" (Activity Sectors) with dedicated pages and interactive hero cards.
- Contact form with validation and Discord webhook integration for notifications.
- Responsive navigation with smooth scrolling.
- PIPEDA-compliant privacy policy and cookie consent modal.
- PWA manifest and favicon configuration.

## External Dependencies

- **React Ecosystem**: React, React DOM, TanStack Query.
- **UI/Styling**: TailwindCSS, Radix UI, Lucide React icons.
- **Backend**: Express, Drizzle ORM, PostgreSQL drivers (Neon Database serverless driver).
- **Development Tools**: Vite, TypeScript, ESBuild, TSX.
- **Security**: reCAPTCHA (site key and secret key required).
- **External Integrations**: Discord webhooks for contact form submissions.
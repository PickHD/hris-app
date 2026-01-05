# HRIS Frontend Application

A modern, responsive Human Resource Information System (HRIS) frontend application built with React, TypeScript, and Vite.

## Tech Stack

### Core Framework
- **React 19.2.0** - Latest React with improved performance and features
- **TypeScript 5.9.3** - Type-safe development with strict mode enabled
- **Vite 7.2.4** - Lightning-fast build tool with dev server
- **React Router DOM 7.11.0** - Client-side routing

### UI & Styling
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component library
  - Dialog, Dropdown Menu, Avatar, Label, Separator, Slot
- **Lucide React** - Beautiful icon library
- **tailwindcss-animate** - Animation utilities for Tailwind
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class name utilities

### State Management & Data Fetching
- **TanStack Query (React Query) 5.90.16** - Powerful data fetching and caching
- **React Hook Form 7.70.0** - Performant form state management
- **Zod 4.3.5** - Schema validation
- **@hookform/resolvers** - Form validation with Zod

### HTTP Client & Utilities
- **Axios 1.13.2** - Promise-based HTTP client
- **date-fns 4.1.0** - Modern date utility library

### Development Tools
- **ESLint 9.39.1** - Code linting with TypeScript, React Hooks, and React Refresh rules
- **@vitejs/plugin-react-swc** - Fast refresh using SWC compiler
- **SWC** - Super-fast TypeScript/JavaScript compiler
- **PostCSS + Autoprefixer** - CSS processing
- **TypeScript ESLint** - Type-aware linting capabilities

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, and other static files
│   ├── components/        # Reusable components
│   │   ├── layout/        # Layout components (header, sidebar, etc.)
│   │   ├── shared/        # Shared application components
│   │   └── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── features/          # Feature-based modules
│   │   └── auth/          # Authentication feature
│   ├── pages/             # Page/route components
│   │   └── auth/          # Authentication pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configurations
│   ├── types/             # TypeScript type definitions
│   ├── config/            # Application configuration
│   ├── App.tsx            # Root application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and CSS variables
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tsconfig.app.json      # App-specific TypeScript config
├── tsconfig.node.json     # Node-specific TypeScript config
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
└── eslint.config.js       # ESLint configuration
```

### Directory Overview

#### `/src/components`
- **`ui/`** - Base UI components built with Radix UI and TailwindCSS (Button, Input, Card, Dialog, etc.)
- **`layout/`** - Layout-specific components that structure the page (Header, Sidebar, Main layout)
- **`shared/`** - Shared components used across multiple features

#### `/src/features`
Feature-based organization where each feature contains its own components, hooks, and logic:
- **`auth/`** - Authentication-related functionality (login, register, password reset)

#### `/src/pages`
Route-level components that correspond to application routes

#### `/src/hooks`
Custom React hooks for reusable stateful logic

#### `/src/lib`
Utility functions, API client configuration, and shared logic

#### `/src/types`
Global TypeScript type definitions and interfaces

#### `/src/config`
Application configuration files (API endpoints, constants, etc.)

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
pnpm build
```

The production build will be in the `dist/` directory

### Preview

```bash
# Preview production build locally
pnpm preview
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## Configuration

### Path Aliases
The project uses path aliases configured in both TypeScript and Vite:
- `@/*` maps to `./src/*`

Example:
```typescript
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
```

### TypeScript Configuration
- **Target:** ES2022
- **Module System:** ESNext with bundler resolution
- **Strict Mode:** Enabled
- **Path Aliases:** Configured for `@/*`
- **Additional Checks:** No unused locals/parameters, no fallthrough cases

### TailwindCSS Configuration
- **Dark Mode:** Class-based strategy
- **Custom Theme:** Extended with CSS variables for theming
- **Design Tokens:** Border radius, colors using HSL values

### ESLint Configuration
- **TypeScript ESLint:** Recommended rules
- **React Hooks:** Enforces rules of hooks
- **React Refresh:** Optimizes for Vite HMR

## Design System

### Color Palette
The application uses HSL-based CSS variables for theming:
- Primary, secondary, accent colors
- Destructive/error states
- Muted/foreground colors
- Chart colors for data visualization

### Component Architecture
- **Composition:** Components are built using composition patterns
- **Variants:** Using `class-variance-authority` for component variants
- **Accessibility:** Radix UI primitives ensure WCAG compliance
- **Responsive:** Mobile-first approach with Tailwind breakpoints

### Styling Approach
- **Utility-First:** TailwindCSS for rapid development
- **Component Variants:** CVA for managing component states
- **CSS-in-JS Alternative:** Using Tailwind's @apply for component-specific styles
- **Dark Mode:** Built-in dark mode support using class strategy

## API Integration

The application uses:
- **Axios** for HTTP requests with interceptors
- **TanStack Query** for data fetching, caching, and state management
- **Zod** for runtime type validation of API responses

## Features

### Authentication
- Login functionality
- Registration
- Password management
- Protected routes
- Session management

### Current Status
The application is in early development with authentication features being implemented.

## Development Guidelines

### Component Organization
1. Place reusable UI components in `components/ui/`
2. Create feature-specific folders in `features/` for complex functionality
3. Use composition over inheritance
4. Keep components small and focused

### Code Style
- Use TypeScript for all new files
- Follow functional programming patterns
- Prefer composition over inheritance
- Use custom hooks for reusable stateful logic
- Implement proper error boundaries

### Performance
- Lazy load routes and heavy components
- Use React.memo for expensive components
- Implement proper loading and error states
- Optimize images and assets
- Leverage TanStack Query's caching

## Browser Support

Modern browsers with ES2022 support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

[Add your license here]

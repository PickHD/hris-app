# HRIS Frontend

A modern, responsive Human Resource Information System frontend built with React, TypeScript, and Vite.

## Tech Stack

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.11.0** - Client-side routing
- **TailwindCSS 3.4.17** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **TanStack Query 5.90.16** - Data fetching and caching
- **React Hook Form 7.70.0** - Form management
- **Zod 4.3.5** - Schema validation
- **Axios 1.13.2** - HTTP client

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components (Button, Input, etc.)
│   │   ├── layout/       # Layout components (Header, Sidebar)
│   │   └── shared/       # Shared components
│   ├── features/         # Feature-based modules
│   │   └── auth/         # Authentication feature
│   ├── pages/            # Route components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API client
│   ├── types/            # TypeScript type definitions
│   └── config/           # App configuration
├── public/               # Static assets
└── index.html            # HTML template
```

## Quick Start

### Using Docker Compose (Recommended)

From the root directory:

```bash
# Copy environment template
cp .env.example .env

# Start all services
docker compose up -d --build

# Check logs
docker compose logs -f frontend
```

The app will be available at `http://localhost:8080`

### Local Development

```bash
cd frontend

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint
```

## Key Features

- **Authentication**: Login, registration, session management
- **Modern UI**: Radix UI components with TailwindCSS styling
- **Type Safety**: Full TypeScript with strict mode
- **Data Fetching**: TanStack Query for API state management
- **Form Validation**: React Hook Form + Zod
- **Dark Mode**: Built-in dark mode support
- **Responsive**: Mobile-first design

## Path Aliases

The project uses `@/*` as an alias for `./src/*`:

```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
```

## Configuration

### Environment Variables

Key variables (see root `.env.example` for complete list):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:8080 |
| `VITE_PORT` | Dev server port | 5173 |

### TypeScript Configuration

- Target: ES2022
- Strict mode: Enabled
- Path aliases: `@/*` → `./src/*`

### TailwindCSS

- Dark mode: Class-based
- Custom theme: CSS variables
- Design tokens: HSL colors

## Component Guidelines

1. Place reusable UI components in `components/ui/`
2. Create feature folders in `features/` for complex functionality
3. Use composition patterns
4. Keep components small and focused
5. Implement proper error boundaries

## API Integration

The app uses:
- **Axios** for HTTP requests with interceptors
- **TanStack Query** for data fetching, caching, and state management
- **Zod** for runtime type validation

## Development Workflow

```bash
# Type check
tsc --noEmit

# Lint
pnpm lint

# Format (if using prettier)
pnpm format
```

## Troubleshooting

**Dependencies issues**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Port already in use**
```bash
# Change port in package.json or use:
pnpm dev --port 3000
```

**Build errors**
```bash
# Clear Vite cache
rm -rf dist
pnpm build
```

## Browser Support

Modern browsers with ES2022 support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

See LICENSE file in the root directory.

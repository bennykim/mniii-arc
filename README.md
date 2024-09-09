# mniii-arc

The core focus of the project is to provide a flexible and scalable system for managing various entities, with features built around user needs.

## Tech Stack

- **React**: The foundational JavaScript library for building user interfaces.
- **React Query**: Efficient data fetching, caching, synchronization, and background updates for React apps.
- **TypeScript**: Strictly typed JavaScript to ensure robustness and minimize runtime errors.
- **Zustand**: Lightweight state management library for React, focused on simplicity and performance.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.

## Folder Structure

```
├── src/                    # Main application source code
│   ├── app/                # App-wide configurations, hooks, and providers
│   ├── entities/           # Core entities and domain logic
│   ├── features/           # Application-specific features (functional modules)
│   ├── pages/              # Page-level components for routing
│   ├── widgets/            # Reusable, UI-specific components
│   ├── shared/             # Shared components, utilities, and hooks
│   ├── mocks/              # Mock data for testing
│   ├── types/              # TypeScript type definitions
│   ...
```

### Feature-Sliced Design (FSD) Architecture

The project is structured following the **Feature-Sliced Design (FSD)** approach, which organizes code based on features and layers. The key components of this structure include:

- **App**: Global configurations, providers, and application-level setup.
- **Entities**: Business logic and core entities shared across the application.
- **Features**: Modularized features that encapsulate specific functionality of the app.
- **Pages**: Page-level components tied to routes.
- **Widgets**: Reusable UI elements.
- **Shared**: Cross-cutting utilities, hooks, and components that are used across features and entities.

This structure promotes better scalability, improved readability, and a more intuitive development experience.

## Roadmap

This project is being developed in a modular, incremental fashion. The first feature to be implemented is **Group Management**, which will allow users to create, edit, and manage groups directly from the dashboard page.

### First Milestone: Group Management on Dashboard

- Implement a dashboard page to serve as the central hub for managing user groups.
- Users will be able to:
  - Create new groups.
  - Edit existing groups.
  - Delete groups.
  - View group details.

This initial feature will lay the foundation for further expansion of management functionalities across the platform.

> to be continued...

## Getting Started

### Installation

Install dependencies using pnpm:

```bash
pnpm install
```

### Running the Application

Start the development server:

```bash
pnpm run dev
```

This will start a Vite-powered development server, and the app will be available at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
pnpm run build
```

The production build will be optimized and output to the `dist/` directory.

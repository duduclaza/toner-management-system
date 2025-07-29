# Toner Management System

## Overview

This is a comprehensive toner management system built with React, Express, and PostgreSQL. The application handles the complete lifecycle of toner cartridges, from general registrations and returns to warranty management and quality homologation. It features a modular architecture with role-based access control and automated calculations for toner usage and recovery values.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom Microsoft-inspired color scheme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Basic in-memory storage (production would use proper session handling)

### Component Structure
- **Layout System**: Responsive sidebar navigation with header
- **Form Components**: Reusable form components for different entities
- **UI Components**: Complete shadcn/ui component library
- **Data Tables**: Generic DataTable component with search, pagination, and CRUD operations

## Key Components

### Authentication & Authorization
- Role-based access control with permissions and module access
- User management with active/inactive status
- Module-specific access control for different parts of the system

### Core Business Modules
1. **Cadastros Gerais (General Registrations)**
   - Toner model management with weight and pricing calculations
   - Status management for warranties and homologations
   - Supplier management with contact information

2. **Retornados (Returns)**
   - Return processing with automatic gramatura calculations
   - Weight-based quality assessment with automated recommendations
   - Client code and branch tracking

3. **Garantias (Warranties)**
   - Multi-item warranty management
   - Document tracking (purchase invoices, return slips)
   - Status workflow management

### Data Processing Features
- **Automatic Calculations**: Gramatura (toner powder weight) calculations
- **Quality Assessment**: Percentage-based recommendations for toner disposal/reuse
- **Value Recovery**: Automatic calculation of recoverable value based on remaining toner

## Data Flow

### Toner Registration Flow
1. Admin creates toner models with physical specifications
2. System calculates gramatura and price per page automatically
3. Models become available for return processing

### Return Processing Flow
1. User selects registered toner model
2. Enters actual weight of returned toner
3. System calculates remaining gramatura percentage
4. Provides automated recommendations based on quality thresholds:
   - 0-5%: Discard
   - 6-40%: Test quality, use internally if good
   - 41-80%: Test quality, stock as semi-new with percentage label
   - 81-100%: Test quality, stock as new

### Warranty Management Flow
1. Create warranty entries with multiple items
2. Track documents and supplier communication
3. Update status throughout warranty process
4. Generate reports and track resolution

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools
- **@tanstack/react-query**: Server state management
- **react-hook-form & @hookform/resolvers**: Form handling with validation
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Comprehensive accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe variant handling for components

### Development Dependencies
- **typescript**: Type safety across frontend and backend
- **vite**: Fast build tool with hot module replacement
- **tsx**: TypeScript execution for development server

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with hot reload
- tsx for running TypeScript backend directly
- Replit-specific plugins for development integration

### Production Build
- Vite builds optimized frontend bundle to `dist/public`
- esbuild bundles backend TypeScript to `dist/index.js`
- Single Node.js process serves both static files and API

### Database Management
- Drizzle migrations stored in `./migrations` directory
- Environment-based database URL configuration
- PostgreSQL schema with UUID primary keys and proper relationships

### Environment Configuration
- Shared schema types between frontend and backend
- Path aliases for clean imports (`@/` for client, `@shared/` for shared types)
- Replit-specific development tools and error overlays

The system is designed to be modular and scalable, with clear separation between frontend and backend concerns, comprehensive type safety, and automated business logic for toner management workflows.
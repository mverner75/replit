# PediTriage - After Hours Pediatric Care Application

## Overview

PediTriage is a full-stack web application designed to provide evidence-based guidance for pediatric symptoms when doctors' offices are closed. The application helps parents and caregivers assess common pediatric symptoms through structured questionnaires and provides recommendations for appropriate care levels (home care, call doctor, or emergency).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom medical-themed color variables
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Pattern**: RESTful endpoints with JSON responses
- **Middleware**: Express.json and urlencoded parsers, custom logging middleware

### Database Schema
The application uses two main tables:
- **assessments**: Stores user assessment data including age group, symptoms, responses, and recommendations
- **medical_protocols**: Contains evidence-based medical protocols with decision tree questions and care guidelines

## Key Components

### Core Application Components
1. **Age Selector**: Allows users to select child's age group (newborn, infant, toddler, child)
2. **Symptom Cards**: Displays common symptoms (fever, rash, cough) with visual indicators
3. **Assessment Engine**: Guides users through symptom-specific questionnaires
4. **Results Display**: Shows care recommendations based on assessment responses
5. **Emergency Guidelines**: Provides clear emergency warning signs
6. **Medical Tools**: Temperature converter and medication dosage calculator

### Storage Layer
- **IStorage Interface**: Defines storage operations for assessments and medical protocols
- **MemStorage**: In-memory implementation for development/testing
- **Database Integration**: Drizzle ORM with PostgreSQL for production

### Medical Protocol Engine
- Evidence-based decision trees for common pediatric symptoms
- Age-specific guidelines and thresholds
- Urgency level determination (low, medium, high, emergency)
- Care recommendation mapping (home_care, call_doctor, emergency)

## Data Flow

1. **User Assessment Flow**:
   - User selects child's age group
   - User selects primary symptom
   - System loads appropriate medical protocol
   - User answers symptom-specific questions
   - System evaluates responses against protocol guidelines
   - System generates urgency level and care recommendation
   - Results are stored and displayed to user

2. **API Data Flow**:
   - GET `/api/protocols/:symptom/:ageGroup` - Retrieves medical protocols
   - POST `/api/assessments` - Creates new assessment
   - GET `/api/assessments/:id` - Retrieves assessment results

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for medical and UI icons
- **Class Variance Authority**: Component variant management

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation for API requests

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **ESBuild**: Fast JavaScript bundler for production

### Database and Backend
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database operations
- **Connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: Serves API routes and static files in development
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend files in production
- **Database Migrations**: Drizzle Kit handles schema migrations

### Key Configuration Files
- **drizzle.config.ts**: Database connection and migration settings
- **vite.config.ts**: Frontend build configuration with path aliases
- **components.json**: Shadcn/ui component configuration
- **tailwind.config.ts**: Tailwind CSS customization with medical color schemes

The application is designed to be deployed as a single Node.js application that serves both the API and frontend assets, with PostgreSQL as the database backend.
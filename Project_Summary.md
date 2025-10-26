# SRMS - Student Record Management System

## Project Overview
A comprehensive full-stack web application for managing student records, built with modern technologies to provide efficient academic administration and student management capabilities.

## Architecture
- **Frontend**: React.js with Vite
- **Backend**: Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: JWT-based authentication

## Technology Stack

### Backend
- **Framework**: Django 4.2+
- **API**: Django REST Framework 3.14+
- **Authentication**: PyJWT 2.8+
- **Database**: SQLite (PostgreSQL ready with psycopg2-binary)
- **CORS**: django-cors-headers 4.0+

### Frontend
- **Framework**: React 19.1+
- **Build Tool**: Vite 7.1+
- **Styling**: Tailwind CSS 4.1+
- **HTTP Client**: Axios 1.12+
- **Routing**: React Router DOM 7.9+
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion 12.23+
- **Charts**: Recharts 3.2+

## Project Structure

### Backend (`/BackEnd`)
- **adminpanel/**: Admin management functionality
- **core/**: Core application logic and utilities
- **shared/**: Shared components, forms, and authentication
- **students/**: Student management module
- **teachers/**: Teacher management module
- **backend_project/**: Django project configuration

### Frontend (`/FrontEnd`)
- **src/api/**: API integration layer
- **src/components/**: Reusable UI components
- **src/pages/**: Application pages/views
- **src/contexts/**: React context providers
- **src/hooks/**: Custom React hooks
- **src/layouts/**: Page layout components
- **src/utils/**: Utility functions

## Key Features
- Student record management
- Teacher administration
- Admin panel for system management
- Role-based access control
- Dynamic forms and approval workflows
- Hierarchical permissions system
- Department and course management

## Development Setup
1. **Backend**: Run `setup.bat` or install requirements from `requirements.txt`
2. **Frontend**: Install dependencies with `npm install`
3. **Development**: Use `npm run dev` for frontend and `python manage.py runserver` for backend

## Database Schema
- Multi-app Django structure with separate models for:
  - Students
  - Teachers
  - Admin users
  - Shared authentication and forms
  - Core system functionality

## Security Features
- JWT token-based authentication
- CORS configuration for cross-origin requests
- Role-based access control
- Secure API endpoints

## Deployment Ready
- PostgreSQL support configured
- Environment-based configuration
- Production-ready build scripts
- Comprehensive .gitignore setup
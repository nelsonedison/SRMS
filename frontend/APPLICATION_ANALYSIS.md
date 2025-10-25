# Application Analysis: Educational Management System

## Overview
A React-based educational management system built with Vite, featuring role-based access control for Admin, Principal, HOD, Tutor, and Student users. The application manages departments, courses, forms, and submissions with comprehensive CRUD operations.

## Technology Stack
- **Frontend Framework**: React 19.1.1 with Vite 7.1.2
- **Styling**: TailwindCSS 4.1.13
- **Routing**: React Router DOM 7.9.4
- **HTTP Client**: Axios 1.12.2
- **UI Components**: Lucide React (icons), Framer Motion (animations)
- **Charts**: Recharts 3.2.1

## File Structure Analysis

### Core Application Structure
```
src/
├── api/                    # API configuration and requests
├── components/             # Reusable UI components
├── contexts/              # React contexts and route protection
├── hooks/                 # Custom React hooks
├── layouts/               # Layout components for different roles
├── pages/                 # Page components organized by role
├── utils/                 # Utility functions
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
```

### API Layer Architecture

#### Configuration (`src/api/`)
- **`apiConfig.js`**: Axios instance with base URL, authentication interceptors
- **`endpoints.js`**: Centralized API endpoint definitions
- **`requests/`**: Organized API request functions by domain

#### Request Organization
```
api/requests/
├── authRequest.js         # Authentication operations
├── studentRequest.js      # Student management
├── teacherRequest.js      # Teacher (tutor, hod, principal) operations
├── adminRequest.js        # Admin functions
├── departmentRequest.js   # Department and course management
└── formRequest.js         # Form and submission handling
```

### Component Architecture

#### Role-Based Components
```
components/
├── admin/                 # Admin-specific components
├── principal/             # Principal dashboard components
├── hod/                   # Head of Department components
├── student/               # Student interface components
├── common/                # Shared UI components (Button, Card, Modal)
└── static/                # Navigation menus and utilities
```

#### Layout System
```
layouts/
├── Admin.jsx             # Admin dashboard layout
├── Principal.jsx         # Principal interface layout
├── Hod.jsx              # HOD dashboard layout
├── Tutor.jsx            # Tutor interface layout
└── Student.jsx          # Student portal layout
```

### Page Structure by Role

#### Admin Pages (`pages/admin/`)
- Dashboard, Departments, Teachers, Students, Courses, Forms, Submissions

#### Student Pages (`pages/student/`)
- Dashboard, Forms, Form View, Submissions, Profile, Settings

#### Tutor Pages (`pages/tutor/`)
- Dashboard, Students, Submissions, Forms, Profile

#### HOD Pages (`pages/hod/`)
- Dashboard, Tutors, Forms, Submissions, Profile

#### Principal Pages (`pages/principal/`)
- Dashboard, Teachers, Students, Departments, Forms, Submissions, Settings

## API Integration Flow

### Authentication Flow
```
1. User Login → authRequest.loginRequest()
2. Token Storage → localStorage.setItem('token')
3. Request Interceptor → Adds Bearer token to headers
4. Protected Routes → ProtectedRoute component validates authentication
```

### API Configuration
- **Base URL**: `http://localhost:8000/api` (from .env)
- **Authentication**: Bearer token in Authorization header
- **Credentials**: Cookies enabled with `withCredentials: true`

### Endpoint Categories

#### Authentication Endpoints
- `POST /shared/login/` - User authentication

#### Student Management
- `POST /students/register/` - Student registration
- `GET /students/profile/` - Student profile
- `GET /students/pending/` - Pending approvals
- `GET /students/approved/` - Approved students
- `PUT /students/{id}/approve/` - Approve/reject student

#### Teacher Management
- `POST /teachers/create/` - Create teacher
- `GET /teachers/list/` - List teachers
- `GET /teachers/profile/` - Teacher profile
- `PUT /teachers/{id}/update/` - Update teacher
- `DELETE /teachers/{id}/deactivate/` - Deactivate teacher

#### Admin Operations
- `POST /admin/register/` - Admin registration
- `POST /admin/create/` - Create admin
- `GET /admin/list/` - List admins
- `PUT /admin/{id}/update/` - Update admin
- `DELETE /admin/{id}/deactivate/` - Deactivate admin

#### Department & Course Management
- `GET /shared/departments/` - List departments
- `POST /shared/departments/create/` - Create department
- `PUT /shared/departments/{id}/update/` - Update department
- `GET /shared/courses/` - List courses
- `POST /shared/courses/create/` - Create course
- `PUT /shared/courses/{id}/update/` - Update course

#### Form Management
- `GET /shared/forms/` - List forms
- `GET /shared/forms/{id}/` - Form details
- `POST /shared/forms/create/` - Create form
- `PUT /shared/forms/{id}/update/` - Update form
- `DELETE /shared/forms/{id}/delete/` - Delete form

#### Submission Management
- `POST /shared/forms/{id}/submit/` - Submit form
- `GET /shared/submissions/my/` - Student submissions
- `GET /shared/submissions/` - List submissions (teachers)
- `PUT /shared/submissions/{id}/review/` - Review submission

### Custom Hooks Architecture

#### Authentication Hook (`hooks/auth.js`)
```javascript
useAuth() {
  - login(credentials)
  - logout()
  - isAuthenticated()
  - getUser()
  - loading state
  - toast notifications
}
```

#### Domain-Specific Hooks
- `admin.js` - Admin operations
- `student.js` - Student management
- `teacher.js` - Teacher operations
- `department.js` - Department handling
- `form.js` - Form management
- `principal.js` - Principal functions
- `hod.js` - HOD operations
- `tutor.js` - Tutor functionality

### Route Protection System

#### Protected Route Implementation
```javascript
ProtectedRoute → useAuth() → isAuthenticated ? children : Navigate('/login')
```

#### Role-Based Routing
```
/admin/*     → AdminLayout → Admin pages
/student/*   → StudentLayout → Student pages
/tutor/*     → TutorLayout → Tutor pages
/hod/*       → HodLayout → HOD pages
/principal/* → PrincipalLayout → Principal pages
```

### State Management Pattern

#### Local State with Hooks
- Authentication state in `useAuth` hook
- Component-level state for UI interactions
- Loading states for async operations
- Toast notifications for user feedback

#### Data Flow
```
Component → Custom Hook → API Request → Response → State Update → UI Render
```

### Error Handling Strategy

#### API Error Handling
```javascript
try {
  const response = await apiClient.request()
  return response.data
} catch (error) {
  throw error // Propagated to hook level
}
```

#### Hook Level Error Management
- Toast notifications for user-facing errors
- Loading states during API calls
- Error state management in custom hooks

## Security Features

### Authentication Security
- JWT token storage in localStorage
- Automatic token attachment via interceptors
- Route protection for authenticated users
- Role-based access control

### API Security
- CORS configuration with credentials
- Bearer token authentication
- Protected endpoints based on user roles

## Development Configuration

### Build Tools
- **Vite**: Fast development server and build tool
- **ESLint**: Code linting with React-specific rules
- **TailwindCSS**: Utility-first CSS framework

### Environment Configuration
- Development server: `npm run dev`
- Production build: `npm run build`
- Code linting: `npm run lint`
- Preview build: `npm run preview`

## Key Features

### Role-Based Access Control
- Admin: Full system management
- Principal: Institution-level management
- HOD: Department-level operations
- Tutor: Student guidance and form review
- Student: Form submission and profile management

### Form Management System
- Dynamic form creation and editing
- Form submission workflow
- Review and approval process
- Submission tracking and history

### User Management
- Student registration and approval workflow
- Teacher creation and management
- Admin user management
- Profile management for all roles

### Department & Course Management
- Department creation and editing
- Course management within departments
- Hierarchical organization structure

This architecture provides a scalable, maintainable foundation for an educational management system with clear separation of concerns and role-based functionality.
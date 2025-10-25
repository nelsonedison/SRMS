# Optimized Project Structure

## Module Organization

### **Core Module** (`core/`)
- **Purpose**: Central authentication tracking only
- **Models**: `LoginTable` - tracks user logins across all user types
- **Views**: Minimal - only central auth endpoints if needed
- **URLs**: Central routing hub

### **Students Module** (`students/`)
- **Purpose**: Student management and authentication
- **Models**: `Student` - with email validation, approval system, academic year management
- **Views**: Registration, login, profile, admin approval endpoints
- **Features**: @icet.ac.in email validation, approval workflow, academic year control

### **Teachers Module** (`teachers/`)
- **Purpose**: Teacher hierarchy management (Principal → HOD → Tutor)
- **Models**: `Teacher` - with role-based permissions and department assignment
- **Views**: Login, CRUD operations with hierarchy enforcement
- **Features**: Single active principal rule, department-based management

### **AdminPanel Module** (`adminpanel/`)
- **Purpose**: System administration
- **Models**: `AdminUser` - system administrators
- **Views**: Admin login, user management across all modules
- **Features**: Superuser capabilities, cross-module management

### **Shared Module** (`shared/`)
- **Purpose**: Common utilities and constants
- **Files**:
  - `constants.py` - Shared choices, error/success messages
  - `utils.py` - JWT handling, response formatting, user retrieval
  - `decorators.py` - Authentication decorators

## Key Optimizations

### **1. Shared Constants**
```python
# All apps use shared constants from shared/constants.py
DEPARTMENT_CHOICES, COURSE_CHOICES, ROLE_CHOICES, etc.
```

### **2. Unified Authentication**
```python
# Single JWT system for all user types
generate_jwt_token(user, user_type='student|teacher|admin')
```

### **3. Standardized Responses**
```python
# Consistent error/success responses
error_response('INVALID_CREDENTIALS')
success_response('LOGIN_SUCCESS', data)
```

### **4. Decorators for Auth**
```python
@require_auth('student')  # Student auth required
@require_admin()          # Admin only
@require_auth('teacher', allow_admin=True)  # Teacher or admin
```

### **5. Proper Error Handling**
- Centralized error messages in constants
- Standardized HTTP status codes
- Consistent response format across all endpoints

## API Structure

### **Students**: `/api/students/`
- `POST /register/` - Student registration
- `POST /login/` - Student login
- `GET /profile/` - Student profile
- `GET /admin/pending/` - Admin: pending approvals
- `PUT /admin/<id>/approve/` - Admin: approve/reject

### **Teachers**: `/api/teachers/`
- `POST /login/` - Teacher login
- `POST /create/` - Admin: create teacher
- `GET /list/` - Role-based teacher listing
- `PUT /<id>/update/` - Update teacher
- `DELETE /<id>/deactivate/` - Deactivate teacher

### **Admin**: `/api/admin/`
- `POST /login/` - Admin login
- `POST /create/` - Create admin user
- `GET /list/` - List admins
- `PUT /<id>/update/` - Update admin
- `DELETE /<id>/deactivate/` - Deactivate admin

## Security Features
- JWT tokens with 7-day expiry
- Role-based access control
- Email domain validation (@icet.ac.in)
- Password hashing
- Academic year validation
- Hierarchy enforcement (Principal → HOD → Tutor)

## Error Handling
- Standardized error messages
- Proper HTTP status codes
- Validation at model and serializer levels
- Try-catch blocks for database operations
- Token validation and expiry handling
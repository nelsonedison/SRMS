# Teachers App API Documentation

## Overview
The teachers app implements a hierarchical role-based system with three roles:
- **Principal**: Can manage HODs and Tutors across all departments
- **HOD**: Can manage Tutors within their department
- **Tutor**: Basic teacher role

## Key Features
- Only one active Principal allowed at a time
- Principal has no department assignment
- HODs and Tutors must be assigned to departments
- Role-based access control for management operations

## API Endpoints

### Authentication
- **POST** `/api/teachers/login/`
  - Body: `{"email": "string", "password": "string"}`
  - Returns: JWT token with role and department info

- **GET** `/api/teachers/profile/`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Teacher profile information

### Teacher Management (Admin Only)
- **POST** `/api/teachers/create/`
  - Headers: `Authorization: Bearer admin-token`
  - Body: `{"name": "string", "email": "string", "phone_number": "string", "employee_id": "string", "role": "principal|hod|tutor", "department": "CSE|ECE|EEE|ME|CE", "password": "string"}`

### Teacher Operations (Role-based Access)
- **GET** `/api/teachers/list/`
  - Admin: See all teachers
  - Principal: See HODs and Tutors
  - HOD: See Tutors in their department

- **PUT** `/api/teachers/<id>/update/`
  - Update teacher details based on hierarchy permissions

- **DELETE** `/api/teachers/<id>/deactivate/`
  - Deactivate teacher based on hierarchy permissions

## Role Hierarchy
```
Admin (Full Access)
  └── Principal (Manage HODs + Tutors)
      └── HOD (Manage Tutors in department)
          └── Tutor (Basic access)
```

## Department Codes
- CSE: Computer Science and Engineering
- ECE: Electronics and Communication Engineering  
- EEE: Electrical and Electronics Engineering
- ME: Mechanical Engineering
- CE: Civil Engineering
# Dynamic Department & Course Management

## Overview
Departments and courses are now dynamic entities that can be created and managed by authorized users.

## Hierarchy & Permissions

### **Department Management**
- **Admin**: Can create and update all departments
- **Principal**: Can create and update all departments  
- **HOD**: Cannot create departments
- **Tutor**: Cannot create departments

### **Course Management**
- **Admin**: Can create and update courses in any department
- **Principal**: Can create and update courses in any department
- **HOD**: Can only create and update courses in their own department
- **Tutor**: Cannot create courses

## API Endpoints

### **Department Endpoints**
- `GET /api/shared/departments/` - List all active departments (public)
- `POST /api/shared/departments/create/` - Create department (Admin/Principal only)
- `PUT /api/shared/departments/<id>/update/` - Update department (Admin/Principal only)

### **Course Endpoints**  
- `GET /api/shared/courses/` - List all active courses (public)
- `GET /api/shared/courses/?department_id=<id>` - List courses by department
- `POST /api/shared/courses/create/` - Create course (Admin/Principal/HOD)
- `PUT /api/shared/courses/<id>/update/` - Update course (Admin/Principal/HOD for own dept)

## Request/Response Examples

### **Create Department**
```json
POST /api/shared/departments/create/
{
    "name": "Computer Science and Engineering",
    "code": "CSE", 
    "description": "Department of Computer Science"
}

Response:
{
    "message": "Department created successfully",
    "department_id": 1,
    "code": "CSE"
}
```

### **Create Course**
```json
POST /api/shared/courses/create/
{
    "name": "Bachelor of Technology",
    "code": "BTECH",
    "department": 1,
    "description": "4-year undergraduate program"
}

Response:
{
    "message": "Course created successfully", 
    "course_id": 1,
    "code": "BTECH"
}
```

### **List Departments**
```json
GET /api/shared/departments/

Response:
{
    "message": "",
    "departments": [
        {
            "id": 1,
            "name": "Computer Science and Engineering",
            "code": "CSE",
            "description": "Department of Computer Science",
            "is_active": true,
            "created_by_type": "principal",
            "created_by_name": "Dr. John Smith",
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

## Model Changes

### **Student Model**
```python
# Changed from CharField to ForeignKey
department = models.ForeignKey(Department, on_delete=models.CASCADE)
course = models.ForeignKey(Course, on_delete=models.CASCADE)
```

### **Teacher Model**
```python
# Changed from CharField to ForeignKey
department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
```

## Creator Tracking
Both Department and Course models track:
- `created_by_type`: 'admin', 'principal', or 'hod'
- `created_by_id`: ID of the creator
- `created_at`: Creation timestamp
- Creator name is resolved in serializers for display

## HOD Restrictions
- HOD can only create courses in their assigned department
- HOD cannot create departments
- HOD cannot create courses in other departments
- System validates department ownership before allowing course creation
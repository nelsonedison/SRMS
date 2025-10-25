# Custom Form Builder System

## Overview
Dynamic form creation system allowing authorized users to create custom request forms for students.

## Form Creation Hierarchy
- **Admin**: Can create forms for any department
- **Principal**: Can create forms for any department
- **HOD**: Can only create forms for their own department
- **Tutor**: Cannot create forms (only students can fill forms)
- **Students**: Cannot create forms (only fill and submit existing forms)

## Field Types Supported
- `text` - Text Input
- `textarea` - Text Area
- `number` - Number Input
- `email` - Email Input
- `date` - Date Picker
- `select` - Dropdown
- `radio` - Radio Buttons
- `checkbox` - Checkboxes
- `file` - File Upload

## API Endpoints

### **Form Management**
- `GET /api/shared/forms/` - List all active forms
- `GET /api/shared/forms/?department_id=<id>` - Filter by department
- `GET /api/shared/forms/<id>/` - Get specific form with fields
- `POST /api/shared/forms/create/` - Create new form (Teacher/Admin)
- `PUT /api/shared/forms/<id>/update/` - Update form status (Teacher/Admin)

### **Form Submissions**
- `POST /api/shared/forms/<id>/submit/` - Submit form (Student only)
- `GET /api/shared/submissions/my/` - Student's submissions
- `GET /api/shared/submissions/` - List all submissions (Teacher/Admin)
- `GET /api/shared/submissions/?form_id=<id>&status=<status>` - Filter submissions
- `PUT /api/shared/submissions/<id>/review/` - Review submission (Teacher/Admin)

## Request Examples

### **Create Form**
```json
POST /api/shared/forms/create/
{
    "title": "Library Book Request",
    "description": "Request form for library books",
    "department": 1,
    "fields": [
        {
            "label": "Student Name",
            "field_type": "text",
            "is_required": true,
            "placeholder": "Enter your full name",
            "order": 1
        },
        {
            "label": "Book Title",
            "field_type": "text",
            "is_required": true,
            "placeholder": "Enter book title",
            "order": 2
        },
        {
            "label": "Request Type",
            "field_type": "select",
            "is_required": true,
            "options": ["Issue", "Return", "Renew"],
            "order": 3
        },
        {
            "label": "Due Date",
            "field_type": "date",
            "is_required": false,
            "order": 4
        }
    ]
}
```

### **Submit Form**
```json
POST /api/shared/forms/1/submit/
{
    "data": {
        "Student Name": "John Doe",
        "Book Title": "Data Structures and Algorithms",
        "Request Type": "Issue",
        "Due Date": "2024-02-15"
    }
}
```

### **Review Submission**
```json
PUT /api/shared/submissions/1/review/
{
    "status": "approved",
    "comments": "Request approved. Book will be available at the library counter."
}
```

## Response Examples

### **Form List**
```json
{
    "message": "",
    "forms": [
        {
            "id": 1,
            "title": "Library Book Request",
            "description": "Request form for library books",
            "department": 1,
            "department_name": "Computer Science and Engineering",
            "is_active": true,
            "created_by_type": "hod",
            "created_by_name": "Dr. Smith",
            "created_at": "2024-01-15T10:30:00Z",
            "fields": [
                {
                    "id": 1,
                    "label": "Student Name",
                    "field_type": "text",
                    "is_required": true,
                    "placeholder": "Enter your full name",
                    "options": [],
                    "order": 1
                }
            ]
        }
    ]
}
```

### **Submission List**
```json
{
    "message": "",
    "submissions": [
        {
            "id": 1,
            "form": 1,
            "form_title": "Library Book Request",
            "student": 1,
            "student_name": "John Doe",
            "student_college_id": "CS001",
            "data": {
                "Student Name": "John Doe",
                "Book Title": "Data Structures"
            },
            "status": "pending",
            "submitted_at": "2024-01-15T14:30:00Z",
            "reviewed_by_type": null,
            "reviewed_by_name": null,
            "reviewed_at": null,
            "comments": ""
        }
    ]
}
```

## Features
- **Dynamic Field Creation**: Support for 9 different field types
- **Field Validation**: Required field validation
- **Department Filtering**: Forms can be department-specific
- **Submission Tracking**: Complete audit trail
- **Review System**: Approve/reject with comments
- **Creator Tracking**: Track who created each form
- **Role-based Access**: Proper permissions for form management
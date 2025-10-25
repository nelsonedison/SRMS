# Frontend Implementation Guide

## Base URL
```
http://localhost:8000/api
```

## Authentication
All authenticated endpoints require:
```
Headers: {
  "Authorization": "Bearer <token>"
}
```

---

## 1. STUDENT ENDPOINTS

### **Student Registration**
```http
POST /students/register/
```
**Request:**
```json
{
  "name": "John Doe",
  "phone_number": "1234567890",
  "email": "john@icet.ac.in",
  "address": "123 Main St",
  "college_id": "CS001",
  "department": 1,
  "course": 1,
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Registration submitted successfully! Please wait for admin approval.",
  "student_id": 1,
  "college_id": "CS001"
}
```

### **Student Login**
```http
POST /students/login/
```
**Request:**
```json
{
  "email": "john@icet.ac.in",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@icet.ac.in",
    "college_id": "CS001",
    "department": 1,
    "course": 1,
    "academic_year_active": true
  }
}
```

### **Student Profile**
```http
GET /students/profile/
```
**Headers:** `Authorization: Bearer <student_token>`
**Response:**
```json
{
  "message": "",
  "id": 1,
  "name": "John Doe",
  "email": "john@icet.ac.in",
  "phone_number": "1234567890",
  "address": "123 Main St",
  "college_id": "CS001",
  "department": 1,
  "course": 1,
  "academic_year_start": "2024-01-01",
  "academic_year_end": "2024-12-31",
  "academic_year_active": true
}
```

### **Student's Form Submissions**
```http
GET /shared/submissions/my/
```
**Headers:** `Authorization: Bearer <student_token>`
**Response:**
```json
{
  "message": "",
  "submissions": [
    {
      "id": 1,
      "form": 1,
      "form_title": "Library Book Request",
      "data": {"Book Title": "Data Structures"},
      "status": "pending_tutor",
      "submitted_at": "2024-01-15T10:30:00Z",
      "tutor_reviewed_by": null,
      "tutor_comments": "",
      "hod_reviewed_by": null,
      "hod_comments": "",
      "principal_reviewed_by": null,
      "principal_comments": ""
    }
  ]
}
```

---

## 2. TEACHER ENDPOINTS

### **Teacher Login**
```http
POST /teachers/login/
```
**Request:**
```json
{
  "email": "teacher@icet.ac.in",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "teacher": {
    "id": 1,
    "name": "Dr. Smith",
    "email": "teacher@icet.ac.in",
    "employee_id": "EMP001",
    "role": "hod",
    "department": 1
  }
}
```

### **Create Teacher (Admin Only)**
```http
POST /teachers/create/
```
**Headers:** `Authorization: Bearer admin-token`
**Request:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@icet.ac.in",
  "phone_number": "9876543210",
  "employee_id": "EMP002",
  "role": "tutor",
  "department": 1,
  "course": 1,
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User created successfully",
  "teacher_id": 2,
  "employee_id": "EMP002"
}
```

### **List Teachers**
```http
GET /teachers/list/
```
**Headers:** `Authorization: Bearer <teacher_token>` or `Authorization: Bearer admin-token`
**Response:**
```json
{
  "message": "",
  "teachers": [
    {
      "id": 1,
      "name": "Dr. Smith",
      "email": "smith@icet.ac.in",
      "employee_id": "EMP001",
      "role": "hod",
      "department": 1,
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 3. ADMIN ENDPOINTS

### **Admin Login**
```http
POST /admin/login/
```
**Request:**
```json
{
  "email": "admin@icet.ac.in",
  "password": "admin123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@icet.ac.in",
    "is_superuser": true
  }
}
```

---

## 4. DEPARTMENT & COURSE ENDPOINTS

### **List Departments**
```http
GET /shared/departments/
```
**Response:**
```json
{
  "message": "",
  "departments": [
    {
      "id": 1,
      "name": "Computer Science and Engineering",
      "code": "CSE",
      "description": "Department of Computer Science",
      "is_active": true,
      "created_by_type": "admin",
      "created_by_name": "Admin User",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **Create Department**
```http
POST /shared/departments/create/
```
**Headers:** `Authorization: Bearer admin-token` or `Authorization: Bearer <principal_token>`
**Request:**
```json
{
  "name": "Electronics and Communication Engineering",
  "code": "ECE",
  "description": "Department of Electronics"
}
```
**Response:**
```json
{
  "message": "Department created successfully",
  "department_id": 2,
  "code": "ECE"
}
```

### **List Courses**
```http
GET /shared/courses/
GET /shared/courses/?department_id=1
```
**Response:**
```json
{
  "message": "",
  "courses": [
    {
      "id": 1,
      "name": "Bachelor of Technology",
      "code": "BTECH",
      "department": 1,
      "department_name": "Computer Science and Engineering",
      "description": "4-year undergraduate program",
      "is_active": true,
      "created_by_type": "hod",
      "created_by_name": "Dr. Smith",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **Create Course**
```http
POST /shared/courses/create/
```
**Headers:** `Authorization: Bearer admin-token`, `Authorization: Bearer <principal_token>`, or `Authorization: Bearer <hod_token>`
**Request:**
```json
{
  "name": "Master of Technology",
  "code": "MTECH",
  "department": 1,
  "description": "2-year postgraduate program"
}
```
**Response:**
```json
{
  "message": "Course created successfully",
  "course_id": 2,
  "code": "MTECH"
}
```

---

## 5. CUSTOM FORM ENDPOINTS

### **List Forms**
```http
GET /shared/forms/
GET /shared/forms/?department_id=1
```
**Response:**
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
          "label": "Book Title",
          "field_type": "text",
          "is_required": true,
          "placeholder": "Enter book title",
          "options": [],
          "order": 1
        },
        {
          "id": 2,
          "label": "Request Type",
          "field_type": "select",
          "is_required": true,
          "placeholder": "",
          "options": ["Issue", "Return", "Renew"],
          "order": 2
        }
      ]
    }
  ]
}
```

### **Get Single Form**
```http
GET /shared/forms/1/
```
**Response:**
```json
{
  "message": "",
  "form": {
    "id": 1,
    "title": "Library Book Request",
    "description": "Request form for library books",
    "department": 1,
    "department_name": "Computer Science and Engineering",
    "is_active": true,
    "fields": [...]
  }
}
```

### **Create Form**
```http
POST /shared/forms/create/
```
**Headers:** `Authorization: Bearer admin-token`, `Authorization: Bearer <principal_token>`, or `Authorization: Bearer <hod_token>`
**Request:**
```json
{
  "title": "Hostel Room Request",
  "description": "Request form for hostel accommodation",
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
      "label": "Room Type",
      "field_type": "select",
      "is_required": true,
      "options": ["Single", "Double", "Triple"],
      "order": 2
    },
    {
      "label": "Check-in Date",
      "field_type": "date",
      "is_required": true,
      "order": 3
    }
  ]
}
```
**Response:**
```json
{
  "message": "Form created successfully",
  "form_id": 2,
  "title": "Hostel Room Request"
}
```

### **Submit Form (Student)**
```http
POST /shared/forms/1/submit/
```
**Headers:** `Authorization: Bearer <student_token>`
**Request:**
```json
{
  "data": {
    "Book Title": "Data Structures and Algorithms",
    "Request Type": "Issue"
  }
}
```
**Response:**
```json
{
  "message": "Form submitted successfully",
  "submission_id": 1
}
```

---

## 6. FORM SUBMISSION REVIEW ENDPOINTS

### **List Pending Submissions (Teachers)**
```http
GET /shared/submissions/
GET /shared/submissions/?form_id=1&status=pending_tutor
```
**Headers:** `Authorization: Bearer <teacher_token>`
**Response:**
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
        "Book Title": "Data Structures",
        "Request Type": "Issue"
      },
      "status": "pending_tutor",
      "submitted_at": "2024-01-15T14:30:00Z",
      "tutor_reviewed_by": null,
      "tutor_reviewed_at": null,
      "tutor_comments": "",
      "hod_reviewed_by": null,
      "hod_reviewed_at": null,
      "hod_comments": "",
      "principal_reviewed_by": null,
      "principal_reviewed_at": null,
      "principal_comments": ""
    }
  ]
}
```

### **Review Submission**
```http
PUT /shared/submissions/1/review/
```
**Headers:** `Authorization: Bearer <teacher_token>`
**Request:**
```json
{
  "action": "approve",
  "comments": "Request approved. Book will be available at library counter."
}
```
**Response:**
```json
{
  "message": "Submission approved successfully"
}
```

---

## 7. STUDENT APPROVAL ENDPOINTS (HOD/Principal)

### **Get Pending Students**
```http
GET /students/pending/
```
**Headers:** `Authorization: Bearer <teacher_token>` (HOD or Principal only)
**Response:**
```json
{
  "message": "",
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@icet.ac.in",
      "phone_number": "1234567890",
      "address": "123 Main St",
      "college_id": "CS001",
      "department": 1,
      "course": 1,
      "approval_status": "pending",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **Approve/Reject Student**
```http
PUT /students/1/approve/
```
**Headers:** `Authorization: Bearer <teacher_token>` (HOD or Principal only)
**Request:**
```json
{
  "action": "approve",
  "academic_year_start": "2024-01-01",
  "academic_year_end": "2024-12-31"
}
```
**Response:**
```json
{
  "message": "Student approved successfully"
}
```

---

## Frontend Implementation Tips

### **1. Authentication Flow**
```javascript
// Store token in localStorage
localStorage.setItem('token', response.data.token);
localStorage.setItem('userType', 'student'); // or 'teacher', 'admin'

// Add to axios headers
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### **2. Role-based Navigation**
```javascript
const userRole = localStorage.getItem('userRole');
if (userRole === 'student') {
  // Show student dashboard, forms, submissions
} else if (userRole === 'tutor') {
  // Show pending tutor approvals
} else if (userRole === 'hod') {
  // Show pending HOD approvals, course management
} else if (userRole === 'principal') {
  // Show pending principal approvals, full management
}
```

### **3. Dynamic Form Rendering**
```javascript
// Render form fields based on field_type
const renderField = (field) => {
  switch(field.field_type) {
    case 'text':
      return <input type="text" required={field.is_required} />;
    case 'select':
      return (
        <select required={field.is_required}>
          {field.options.map(option => 
            <option value={option}>{option}</option>
          )}
        </select>
      );
    case 'date':
      return <input type="date" required={field.is_required} />;
    // ... other field types
  }
};
```

### **4. Status Display**
```javascript
const getStatusColor = (status) => {
  switch(status) {
    case 'pending_tutor': return 'orange';
    case 'pending_hod': return 'blue';
    case 'pending_principal': return 'purple';
    case 'approved': return 'green';
    case 'rejected': return 'red';
  }
};
```

### **5. Error Handling**
```javascript
try {
  const response = await axios.post('/api/students/login/', data);
  // Handle success
} catch (error) {
  if (error.response?.data?.error) {
    setError(error.response.data.error);
  }
}
```
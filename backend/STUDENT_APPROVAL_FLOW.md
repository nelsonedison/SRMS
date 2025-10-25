# Student Approval Flow

## Updated Process

### **1. Student Registration**
- Students register directly via `/api/students/register/`
- Status automatically set to `pending`
- No admin involvement in registration

### **2. Approval Authority**
- **HOD**: Can approve students from their department only
- **Principal**: Can approve students from all departments
- **Admin**: No longer involved in student approval process

### **3. API Endpoints**

#### **For HOD/Principal:**
- `GET /api/students/pending/` - View pending students
  - HOD: Only sees students from their department
  - Principal: Sees all pending students

- `PUT /api/students/<id>/approve/` - Approve/reject student
  - HOD: Can only approve students from their department
  - Principal: Can approve any student
  - Body: `{"action": "approve|reject", "academic_year_start": "YYYY-MM-DD", "academic_year_end": "YYYY-MM-DD"}`

- `GET /api/students/approved/` - View approved students
  - HOD: Only sees approved students from their department
  - Principal: Sees all approved students

### **4. Access Control**
```python
# HOD Example
if request.user.role == 'hod':
    students = Student.objects.filter(
        approval_status='pending', 
        department=request.user.department
    )

# Principal Example  
if request.user.role == 'principal':
    students = Student.objects.filter(approval_status='pending')
```

### **5. Workflow**
1. **Student** → Registers with department selection
2. **HOD/Principal** → Reviews pending students
3. **HOD/Principal** → Approves with academic year dates
4. **Student** → Can now login and access system

### **6. Department-based Filtering**
- HOD of CSE can only see/approve CSE students
- HOD of ECE can only see/approve ECE students
- Principal can see/approve students from all departments

This ensures proper hierarchy where department heads manage their students and principal has overall authority.
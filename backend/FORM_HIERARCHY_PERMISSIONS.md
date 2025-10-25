# Form Management Hierarchy Permissions

## Form Creation
- **Admin**: Can create forms for any department
- **Principal**: Can create forms for any department  
- **HOD**: Can create forms only for their own department
- **Tutor**: Cannot create forms
- **Students**: Cannot create forms (only fill and submit)

## Form Management (Update/Delete) Hierarchy

### **Forms Created by Admin**
- **Admin**: ✅ Can update/delete
- **Principal**: ❌ Cannot update/delete
- **HOD**: ❌ Cannot update/delete

### **Forms Created by Principal**
- **Admin**: ✅ Can update/delete
- **Principal** (same user): ✅ Can update/delete
- **Principal** (different user): ❌ Cannot update/delete
- **HOD**: ❌ Cannot update/delete

### **Forms Created by HOD**
- **Admin**: ✅ Can update/delete
- **Principal**: ✅ Can update/delete
- **HOD** (same user): ✅ Can update/delete
- **HOD** (different user): ❌ Cannot update/delete

## Permission Logic
```python
def can_manage_form(user_type, user, form):
    if user_type == 'admin':
        return True
    
    if form.created_by_type == 'admin':
        return user_type == 'admin'
    elif form.created_by_type == 'principal':
        return (user_type == 'admin' or 
                (user_type == 'teacher' and user.role == 'principal' and user.id == form.created_by_id))
    elif form.created_by_type == 'hod':
        return (user_type == 'admin' or 
                (user_type == 'teacher' and user.role == 'principal') or
                (user_type == 'teacher' and user.role == 'hod' and user.id == form.created_by_id))
    
    return False
```

## API Endpoints with Permissions

### **Form Management**
- `POST /api/shared/forms/create/` - Admin, Principal, HOD only
- `PUT /api/shared/forms/<id>/update/` - Based on hierarchy rules
- `DELETE /api/shared/forms/<id>/delete/` - Based on hierarchy rules

### **Form Submissions** 
- `POST /api/shared/forms/<id>/submit/` - Students only
- `GET /api/shared/submissions/my/` - Students (own submissions)
- `GET /api/shared/submissions/` - Teachers/Admin (review submissions)
- `PUT /api/shared/submissions/<id>/review/` - Teachers/Admin

## Examples

### **Scenario 1**: HOD creates a form
- HOD can update/delete their own form
- Principal can update/delete the HOD's form
- Admin can update/delete the HOD's form
- Other HODs cannot manage this form

### **Scenario 2**: Principal creates a form
- Only that Principal can update/delete their form
- Admin can update/delete the Principal's form
- HODs cannot manage this form
- Other Principals cannot manage this form

### **Scenario 3**: Admin creates a form
- Only Admin can update/delete admin-created forms
- Principals and HODs cannot manage admin forms
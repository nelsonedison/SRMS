# Hierarchical Approval Workflow

## System Structure

### **Teacher Assignment**
- **Principal**: One per institution (no department/course assignment)
- **HOD**: One per department (assigned to department only)
- **Tutor**: One per course (assigned to both department and course)

### **Student Assignment**
- Students are assigned to both department and course
- Course belongs to a department

## Approval Workflow

### **Step 1: Student Submission**
- Student submits form
- Status: `pending_tutor`
- Form goes to tutor assigned to student's course

### **Step 2: Tutor Review**
- Only the tutor assigned to student's course can review
- Actions: `approve` or `reject`
- If approved: Status → `pending_hod`
- If rejected: Status → `rejected` (workflow ends)

### **Step 3: HOD Review**
- Only the HOD of student's department can review
- Actions: `approve` or `reject`
- If approved: Status → `pending_principal`
- If rejected: Status → `rejected` (workflow ends)

### **Step 4: Principal Review**
- Only the principal can review
- Actions: `approve` or `reject`
- If approved: Status → `approved` (workflow complete)
- If rejected: Status → `rejected` (workflow ends)

## API Endpoints

### **Review Submission**
```
PUT /api/shared/submissions/<id>/review/
{
    "action": "approve|reject",
    "comments": "Review comments"
}
```

### **List Pending Submissions**
```
GET /api/shared/submissions/
```
- **Tutor**: Sees submissions pending tutor approval for their course
- **HOD**: Sees submissions pending HOD approval for their department  
- **Principal**: Sees submissions pending principal approval

## Status Flow
```
pending_tutor → pending_hod → pending_principal → approved
     ↓              ↓              ↓
  rejected      rejected      rejected
```

## Database Fields
```python
# FormSubmission model tracks each level separately:
tutor_reviewed_by, tutor_reviewed_at, tutor_comments
hod_reviewed_by, hod_reviewed_at, hod_comments  
principal_reviewed_by, principal_reviewed_at, principal_comments
```

## Access Control
- Each reviewer can only act when submission is at their approval stage
- Reviewers can only see submissions assigned to them
- No skipping levels - must follow sequential approval
- Rejection at any level stops the workflow

## Example Workflow
1. **CSE Student** submits "Library Book Request"
2. **CSE BTECH Tutor** reviews → Approves
3. **CSE HOD** reviews → Approves  
4. **Principal** reviews → Approves
5. Status: `approved` - Request complete
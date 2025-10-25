# Custom Forms Frontend Implementation Guide

## Overview
The custom forms system allows authorized users to create dynamic forms that students can fill and submit. The system supports 9 different field types and hierarchical approval workflow.

---

## 1. FORM CREATION

### **Who Can Create Forms**
- **Admin**: All departments
- **Principal**: All departments
- **HOD**: Own department only

### **Create Form API**
```http
POST /api/shared/forms/create/
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### **Request Body Structure**
```json
{
  "title": "Library Book Request",
  "description": "Form to request library books",
  "department": 1,
  "fields": [
    {
      "label": "Student Name",
      "field_type": "text",
      "is_required": true,
      "placeholder": "Enter your full name",
      "options": [],
      "order": 1
    },
    {
      "label": "Book Category",
      "field_type": "select",
      "is_required": true,
      "placeholder": "",
      "options": ["Fiction", "Non-Fiction", "Academic", "Reference"],
      "order": 2
    },
    {
      "label": "Request Date",
      "field_type": "date",
      "is_required": true,
      "placeholder": "",
      "options": [],
      "order": 3
    }
  ]
}
```

### **Field Types & Properties**

| Field Type | Description | Required Properties | Optional Properties |
|------------|-------------|-------------------|-------------------|
| `text` | Single line text | `label`, `field_type`, `order` | `is_required`, `placeholder` |
| `textarea` | Multi-line text | `label`, `field_type`, `order` | `is_required`, `placeholder` |
| `number` | Numeric input | `label`, `field_type`, `order` | `is_required`, `placeholder` |
| `email` | Email input | `label`, `field_type`, `order` | `is_required`, `placeholder` |
| `date` | Date picker | `label`, `field_type`, `order` | `is_required` |
| `select` | Dropdown | `label`, `field_type`, `order`, `options` | `is_required` |
| `radio` | Radio buttons | `label`, `field_type`, `order`, `options` | `is_required` |
| `checkbox` | Checkboxes | `label`, `field_type`, `order`, `options` | `is_required` |
| `file` | File upload | `label`, `field_type`, `order` | `is_required` |

### **Frontend Form Builder Example**
```javascript
const FormBuilder = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    fields: []
  });

  const addField = (fieldType) => {
    const newField = {
      label: '',
      field_type: fieldType,
      is_required: false,
      placeholder: '',
      options: fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox' ? [''] : [],
      order: formData.fields.length + 1
    };
    setFormData({
      ...formData,
      fields: [...formData.fields, newField]
    });
  };

  const updateField = (index, property, value) => {
    const updatedFields = [...formData.fields];
    updatedFields[index][property] = value;
    setFormData({ ...formData, fields: updatedFields });
  };

  const createForm = async () => {
    const response = await fetch('/api/shared/forms/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Form created:', result);
    }
  };

  return (
    <div>
      <input 
        placeholder="Form Title"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      
      <textarea 
        placeholder="Form Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      
      <select 
        value={formData.department}
        onChange={(e) => setFormData({...formData, department: e.target.value})}
      >
        <option value="">Select Department</option>
        {/* Load departments from API */}
      </select>

      {/* Field Builder */}
      {formData.fields.map((field, index) => (
        <FieldBuilder 
          key={index}
          field={field}
          onUpdate={(property, value) => updateField(index, property, value)}
        />
      ))}

      <button onClick={() => addField('text')}>Add Text Field</button>
      <button onClick={() => addField('select')}>Add Dropdown</button>
      {/* More field type buttons */}
      
      <button onClick={createForm}>Create Form</button>
    </div>
  );
};
```

---

## 2. FORM LISTING & RETRIEVAL

### **List All Forms**
```http
GET /api/shared/forms/
GET /api/shared/forms/?department_id=1
```

### **Response Structure**
```json
{
  "message": "",
  "forms": [
    {
      "id": 1,
      "title": "Library Book Request",
      "description": "Form to request library books",
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

### **Get Single Form**
```http
GET /api/shared/forms/1/
```

### **Frontend Form Display**
```javascript
const FormList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    const response = await fetch('/api/shared/forms/');
    const data = await response.json();
    setForms(data.forms);
  };

  return (
    <div>
      {forms.map(form => (
        <div key={form.id} className="form-card">
          <h3>{form.title}</h3>
          <p>{form.description}</p>
          <p>Department: {form.department_name}</p>
          <p>Created by: {form.created_by_name}</p>
          <button onClick={() => viewForm(form.id)}>View Form</button>
        </div>
      ))}
    </div>
  );
};
```

---

## 3. FORM SUBMISSION (Students)

### **Submit Form API**
```http
POST /api/shared/forms/1/submit/
Authorization: Bearer <student_jwt_token>
Content-Type: application/json
```

### **Request Body**
```json
{
  "data": {
    "Student Name": "John Doe",
    "Book Category": "Academic",
    "Request Date": "2024-02-15",
    "Additional Notes": "Need for project work"
  }
}
```

### **Dynamic Form Renderer**
```javascript
const FormRenderer = ({ form }) => {
  const [formData, setFormData] = useState({});

  const renderField = (field) => {
    switch (field.field_type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            required={field.is_required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            required={field.is_required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
          />
        );

      case 'select':
        return (
          <select
            required={field.is_required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
          >
            <option value="">Select an option</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div>
            {field.options.map(option => (
              <label key={option}>
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  required={field.is_required}
                  onChange={(e) => setFormData({
                    ...formData,
                    [field.label]: e.target.value
                  })}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div>
            {field.options.map(option => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  onChange={(e) => {
                    const currentValues = formData[field.label] || [];
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        [field.label]: [...currentValues, option]
                      });
                    } else {
                      setFormData({
                        ...formData,
                        [field.label]: currentValues.filter(v => v !== option)
                      });
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            required={field.is_required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            required={field.is_required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            required={field.is_required}
            value={formData[field.label] || ''}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.value
            })}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            required={field.is_required}
            onChange={(e) => setFormData({
              ...formData,
              [field.label]: e.target.files[0]
            })}
          />
        );

      default:
        return null;
    }
  };

  const submitForm = async () => {
    const response = await fetch(`/api/shared/forms/${form.id}/submit/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: formData })
    });

    if (response.ok) {
      alert('Form submitted successfully!');
    }
  };

  return (
    <div>
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      
      {form.fields
        .sort((a, b) => a.order - b.order)
        .map(field => (
          <div key={field.id} className="form-field">
            <label>
              {field.label}
              {field.is_required && <span className="required">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      
      <button onClick={submitForm}>Submit Form</button>
    </div>
  );
};
```

---

## 4. FORM MANAGEMENT (Update/Delete)

### **Update Form**
```http
PUT /api/shared/forms/1/update/
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### **Request Body**
```json
{
  "title": "Updated Library Book Request",
  "description": "Updated description",
  "is_active": true
}
```

### **Delete Form**
```http
DELETE /api/shared/forms/1/delete/
Authorization: Bearer <jwt_token>
```

### **Form Management Permissions**
- **Admin-created forms**: Only Admin can update/delete
- **Principal-created forms**: Admin + that Principal can update/delete
- **HOD-created forms**: Admin + any Principal + that HOD can update/delete

---

## 5. SUBMISSION TRACKING & REVIEW

### **Student: View Own Submissions**
```http
GET /api/shared/submissions/my/
Authorization: Bearer <student_jwt_token>
```

### **Teachers: View Pending Submissions**
```http
GET /api/shared/submissions/
Authorization: Bearer <teacher_jwt_token>
```

### **Submission Status Flow**
```
pending_tutor → pending_hod → pending_principal → approved
     ↓              ↓              ↓
  rejected      rejected      rejected
```

### **Review Submission**
```http
PUT /api/shared/submissions/1/review/
Authorization: Bearer <teacher_jwt_token>
Content-Type: application/json
```

### **Request Body**
```json
{
  "action": "approve",
  "comments": "Request approved. Please collect from office."
}
```

### **Submission Tracking Component**
```javascript
const SubmissionTracker = ({ submissionId }) => {
  const [submission, setSubmission] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_tutor': return '#ff9800';
      case 'pending_hod': return '#2196f3';
      case 'pending_principal': return '#9c27b0';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_tutor': return 'Pending Tutor Approval';
      case 'pending_hod': return 'Pending HOD Approval';
      case 'pending_principal': return 'Pending Principal Approval';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="submission-tracker">
      <div className="status-indicator" style={{ color: getStatusColor(submission?.status) }}>
        {getStatusText(submission?.status)}
      </div>
      
      <div className="approval-timeline">
        <div className={`step ${submission?.tutor_reviewed_at ? 'completed' : ''}`}>
          <h4>Tutor Review</h4>
          {submission?.tutor_reviewed_at && (
            <p>Reviewed: {new Date(submission.tutor_reviewed_at).toLocaleDateString()}</p>
          )}
          {submission?.tutor_comments && <p>Comments: {submission.tutor_comments}</p>}
        </div>
        
        <div className={`step ${submission?.hod_reviewed_at ? 'completed' : ''}`}>
          <h4>HOD Review</h4>
          {submission?.hod_reviewed_at && (
            <p>Reviewed: {new Date(submission.hod_reviewed_at).toLocaleDateString()}</p>
          )}
          {submission?.hod_comments && <p>Comments: {submission.hod_comments}</p>}
        </div>
        
        <div className={`step ${submission?.principal_reviewed_at ? 'completed' : ''}`}>
          <h4>Principal Review</h4>
          {submission?.principal_reviewed_at && (
            <p>Reviewed: {new Date(submission.principal_reviewed_at).toLocaleDateString()}</p>
          )}
          {submission?.principal_comments && <p>Comments: {submission.principal_comments}</p>}
        </div>
      </div>
    </div>
  );
};
```

---

## 6. COMPLETE WORKFLOW EXAMPLE

### **1. Admin/Principal/HOD Creates Form**
```javascript
// Form creation with multiple field types
const formData = {
  title: "Hostel Room Request",
  description: "Request form for hostel accommodation",
  department: 1,
  fields: [
    {
      label: "Student Name",
      field_type: "text",
      is_required: true,
      placeholder: "Enter full name",
      order: 1
    },
    {
      label: "Room Type",
      field_type: "select",
      is_required: true,
      options: ["Single", "Double", "Triple"],
      order: 2
    },
    {
      label: "Check-in Date",
      field_type: "date",
      is_required: true,
      order: 3
    },
    {
      label: "Special Requirements",
      field_type: "textarea",
      is_required: false,
      placeholder: "Any special needs or requirements",
      order: 4
    }
  ]
};
```

### **2. Student Fills and Submits Form**
```javascript
const submissionData = {
  data: {
    "Student Name": "John Doe",
    "Room Type": "Single",
    "Check-in Date": "2024-03-01",
    "Special Requirements": "Ground floor preferred due to mobility issues"
  }
};
```

### **3. Hierarchical Approval Process**
- **Tutor** reviews and approves
- **HOD** reviews and approves  
- **Principal** gives final approval
- **Student** receives notification of approval/rejection

This system provides complete flexibility for creating custom forms while maintaining proper approval workflows and access controls.
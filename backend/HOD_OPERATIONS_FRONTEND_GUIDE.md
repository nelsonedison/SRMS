# HOD Operations Frontend Implementation Guide

## Overview
Complete guide for implementing HOD (Head of Department) operations including teacher management, form creation, submission reviews, and department oversight.

---


---

## 2. HOD PROFILE

### **Profile API**
```http
GET /api/teachers/profile/
Authorization: Bearer <hod_jwt_token>
```

### **Response**
```json
{
  "message": "",
  "id": 2,
  "name": "Dr. Jane Smith",
  "email": "hod@icet.ac.in",
  "phone_number": "9876543210",
  "employee_id": "HOD001",
  "role": "hod",
  "department_id": 1,
  "department_name": "Computer Science and Engineering",
  "course_id": null,
  "course_name": null,
  "is_active": true
}
```

### **Frontend Profile Component**
```javascript
const HODProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/teachers/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="hod-profile">
      <h2>HOD Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Employee ID:</strong> {profile.employee_id}</p>
        <p><strong>Department:</strong> {profile.department_name}</p>
        <p><strong>Role:</strong> {profile.role.toUpperCase()}</p>
      </div>
    </div>
  );
};
```

---

## 3. TUTOR MANAGEMENT

### **List Tutors API**
```http
GET /api/teachers/list/
Authorization: Bearer <hod_jwt_token>
```

### **Response**
```json
{
  "message": "",
  "teachers": [
    {
      "id": 3,
      "name": "Prof. John Doe",
      "email": "tutor1@icet.ac.in",
      "employee_id": "TUT001",
      "role": "tutor",
      "department_id": 1,
      "department_name": "Computer Science and Engineering",
      "course_id": 1,
      "course_name": "Bachelor of Technology",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **Frontend Tutor Management Component**
```javascript
const TutorManagement = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await fetch('/api/teachers/list/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTutors(data.teachers);
      }
    } catch (error) {
      console.error('Failed to load tutors');
    } finally {
      setLoading(false);
    }
  };

  const deactivateTutor = async (tutorId) => {
    if (!confirm('Are you sure you want to deactivate this tutor?')) return;

    try {
      const response = await fetch(`/api/teachers/deactivate/${tutorId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('Tutor deactivated successfully');
        fetchTutors();
      } else {
        alert('Failed to deactivate tutor');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  if (loading) return <div>Loading tutors...</div>;

  return (
    <div className="tutor-management">
      <h2>Department Tutors</h2>
      
      <div className="tutors-list">
        {tutors.map(tutor => (
          <div key={tutor.id} className="tutor-card">
            <h3>{tutor.name}</h3>
            <p><strong>Employee ID:</strong> {tutor.employee_id}</p>
            <p><strong>Email:</strong> {tutor.email}</p>
            <p><strong>Course:</strong> {tutor.course_name}</p>
            <p><strong>Status:</strong> 
              <span className={tutor.is_active ? 'active' : 'inactive'}>
                {tutor.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>
            
            <div className="tutor-actions">
              <button 
                onClick={() => deactivateTutor(tutor.id)}
                className="btn-danger"
                disabled={!tutor.is_active}
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 4. FORM CREATION

### **Create Form API**
```http
POST /api/shared/forms/create/
Authorization: Bearer <hod_jwt_token>
Content-Type: application/json
```

### **Request**
```json
{
  "title": "Leave Application Form",
  "description": "Form for students to apply for leave",
  "department": 1,
  "fields": [
    {
      "label": "Leave Type",
      "field_type": "select",
      "is_required": true,
      "options": ["Sick Leave", "Personal Leave", "Emergency Leave"]
    },
    {
      "label": "Start Date",
      "field_type": "date",
      "is_required": true
    },
    {
      "label": "End Date",
      "field_type": "date",
      "is_required": true
    },
    {
      "label": "Reason",
      "field_type": "textarea",
      "is_required": true
    }
  ]
}
```

### **Frontend Form Creation Component**
```javascript
const CreateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    fields: []
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
    // Auto-set HOD's department
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.department) {
      setFormData(prev => ({ ...prev, department: user.department }));
    }
  }, []);

  const fetchDepartments = async () => {
    const response = await fetch('/api/shared/departments/');
    const data = await response.json();
    setDepartments(data.departments);
  };

  const addField = () => {
    const newField = {
      label: '',
      field_type: 'text',
      is_required: false,
      options: []
    };
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index, field) => {
    const updatedFields = [...formData.fields];
    updatedFields[index] = field;
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  const removeField = (index) => {
    const updatedFields = formData.fields.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, fields: updatedFields }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/shared/forms/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('Form created successfully!');
        setFormData({ title: '', description: '', department: '', fields: [] });
      } else {
        alert(result.error || 'Failed to create form');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-form">
      <h2>Create New Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Form Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="form-fields">
          <h3>Form Fields</h3>
          
          {formData.fields.map((field, index) => (
            <FormFieldEditor
              key={index}
              field={field}
              onUpdate={(updatedField) => updateField(index, updatedField)}
              onRemove={() => removeField(index)}
            />
          ))}
          
          <button type="button" onClick={addField} className="btn-secondary">
            Add Field
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Form'}
        </button>
      </form>
    </div>
  );
};

const FormFieldEditor = ({ field, onUpdate, onRemove }) => {
  const fieldTypes = [
    'text', 'textarea', 'select', 'radio', 'checkbox', 
    'date', 'number', 'email', 'file'
  ];

  const updateField = (key, value) => {
    onUpdate({ ...field, [key]: value });
  };

  return (
    <div className="field-editor">
      <div className="field-header">
        <input
          type="text"
          placeholder="Field Label"
          value={field.label}
          onChange={(e) => updateField('label', e.target.value)}
        />
        <select
          value={field.field_type}
          onChange={(e) => updateField('field_type', e.target.value)}
        >
          {fieldTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <label>
          <input
            type="checkbox"
            checked={field.is_required}
            onChange={(e) => updateField('is_required', e.target.checked)}
          />
          Required
        </label>
        <button type="button" onClick={onRemove} className="btn-danger">
          Remove
        </button>
      </div>

      {['select', 'radio', 'checkbox'].includes(field.field_type) && (
        <div className="field-options">
          <label>Options (one per line):</label>
          <textarea
            value={field.options.join('\n')}
            onChange={(e) => updateField('options', e.target.value.split('\n').filter(opt => opt.trim()))}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
          />
        </div>
      )}
    </div>
  );
};
```

---

## 5. SUBMISSION REVIEWS

### **List Submissions API**
```http
GET /api/shared/forms/submissions/?status=pending_hod
Authorization: Bearer <hod_jwt_token>
```

### **Response**
```json
{
  "message": "",
  "submissions": [
    {
      "id": 1,
      "form_title": "Leave Application Form",
      "student_name": "John Doe",
      "student_college_id": "CS2024001",
      "data": {
        "Leave Type": "Sick Leave",
        "Start Date": "2024-01-20",
        "End Date": "2024-01-22",
        "Reason": "Medical treatment"
      },
      "status": "pending_hod",
      "submitted_at": "2024-01-15T14:30:00Z",
      "tutor_comments": "Approved by tutor"
    }
  ]
}
```

### **Review Submission API**
```http
PUT /api/shared/forms/submissions/1/review/
Authorization: Bearer <hod_jwt_token>
Content-Type: application/json
```

### **Request**
```json
{
  "action": "approve",
  "comments": "Leave approved by HOD"
}
```

### **Frontend Submission Review Component**
```javascript
const SubmissionReviews = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewData, setReviewData] = useState({
    action: '',
    comments: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/shared/forms/submissions/?status=pending_hod', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId) => {
    if (!reviewData.action) {
      alert('Please select an action');
      return;
    }

    try {
      const response = await fetch(`/api/shared/forms/submissions/${submissionId}/review/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        alert(`Submission ${reviewData.action}d successfully`);
        setSelectedSubmission(null);
        setReviewData({ action: '', comments: '' });
        fetchSubmissions();
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to review submission');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="submission-reviews">
      <h2>Pending HOD Reviews</h2>
      
      <div className="submissions-list">
        {submissions.length === 0 ? (
          <p>No submissions pending your review</p>
        ) : (
          submissions.map(submission => (
            <div key={submission.id} className="submission-card">
              <div className="submission-header">
                <h3>{submission.form_title}</h3>
                <span className="status pending">Pending HOD Review</span>
              </div>
              
              <div className="submission-info">
                <p><strong>Student:</strong> {submission.student_name} ({submission.student_college_id})</p>
                <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
                {submission.tutor_comments && (
                  <p><strong>Tutor Comments:</strong> {submission.tutor_comments}</p>
                )}
              </div>

              <div className="submission-data">
                <h4>Form Data:</h4>
                {Object.entries(submission.data).map(([key, value]) => (
                  <p key={key}><strong>{key}:</strong> {value}</p>
                ))}
              </div>

              <div className="review-actions">
                <button 
                  onClick={() => setSelectedSubmission(submission.id)}
                  className="btn-primary"
                >
                  Review
                </button>
              </div>

              {selectedSubmission === submission.id && (
                <div className="review-modal">
                  <div className="review-form">
                    <h4>Review Submission</h4>
                    
                    <div className="action-buttons">
                      <button
                        className={`btn ${reviewData.action === 'approve' ? 'btn-success active' : 'btn-outline'}`}
                        onClick={() => setReviewData({...reviewData, action: 'approve'})}
                      >
                        Approve
                      </button>
                      <button
                        className={`btn ${reviewData.action === 'reject' ? 'btn-danger active' : 'btn-outline'}`}
                        onClick={() => setReviewData({...reviewData, action: 'reject'})}
                      >
                        Reject
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Comments:</label>
                      <textarea
                        value={reviewData.comments}
                        onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                        placeholder="Add your comments..."
                        rows="3"
                      />
                    </div>

                    <div className="modal-actions">
                      <button 
                        onClick={() => handleReview(submission.id)}
                        className="btn-primary"
                        disabled={!reviewData.action}
                      >
                        Submit Review
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedSubmission(null);
                          setReviewData({ action: '', comments: '' });
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
```

---

## 6. DEPARTMENT FORMS MANAGEMENT

### **List Department Forms API**
```http
GET /api/shared/forms/?department_id=1
Authorization: Bearer <hod_jwt_token>
```

### **Frontend Forms Management Component**
```javascript
const FormsManagement = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/shared/forms/?department_id=${user.department}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data.forms);
      }
    } catch (error) {
      console.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      const response = await fetch(`/api/shared/forms/${formId}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        fetchForms();
      }
    } catch (error) {
      alert('Failed to update form status');
    }
  };

  if (loading) return <div>Loading forms...</div>;

  return (
    <div className="forms-management">
      <h2>Department Forms</h2>
      
      <div className="forms-header">
        <button 
          onClick={() => window.location.href = '/hod/create-form'}
          className="btn-primary"
        >
          Create New Form
        </button>
      </div>

      <div className="forms-list">
        {forms.map(form => (
          <div key={form.id} className="form-card">
            <div className="form-header">
              <h3>{form.title}</h3>
              <span className={`status ${form.is_active ? 'active' : 'inactive'}`}>
                {form.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="form-description">{form.description}</p>
            
            <div className="form-meta">
              <p><strong>Created:</strong> {new Date(form.created_at).toLocaleDateString()}</p>
              <p><strong>Fields:</strong> {form.fields.length}</p>
            </div>

            <div className="form-actions">
              <button
                onClick={() => toggleFormStatus(form.id, form.is_active)}
                className={form.is_active ? 'btn-warning' : 'btn-success'}
              >
                {form.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 7. HOD DASHBOARD

### **Frontend Dashboard Component**
```javascript
const HODDashboard = () => {
  const [stats, setStats] = useState({
    pendingReviews: 0,
    activeForms: 0,
    departmentTutors: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending reviews
      const reviewsResponse = await fetch('/api/shared/forms/submissions/?status=pending_hod', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const reviewsData = await reviewsResponse.json();
      
      // Fetch department forms
      const user = JSON.parse(localStorage.getItem('user'));
      const formsResponse = await fetch(`/api/shared/forms/?department_id=${user.department}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const formsData = await formsResponse.json();
      
      // Fetch tutors
      const tutorsResponse = await fetch('/api/teachers/list/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const tutorsData = await tutorsResponse.json();

      setStats({
        pendingReviews: reviewsData.submissions?.length || 0,
        activeForms: formsData.forms?.filter(f => f.is_active).length || 0,
        departmentTutors: tutorsData.teachers?.length || 0
      });

      setRecentSubmissions(reviewsData.submissions?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load dashboard data');
    }
  };

  return (
    <div className="hod-dashboard">
      <h1>HOD Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Reviews</h3>
          <div className="stat-number">{stats.pendingReviews}</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Forms</h3>
          <div className="stat-number">{stats.activeForms}</div>
        </div>
        
        <div className="stat-card">
          <h3>Department Tutors</h3>
          <div className="stat-number">{stats.departmentTutors}</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-submissions">
          <h2>Recent Submissions for Review</h2>
          {recentSubmissions.length === 0 ? (
            <p>No pending submissions</p>
          ) : (
            <div className="submissions-preview">
              {recentSubmissions.map(submission => (
                <div key={submission.id} className="submission-preview">
                  <h4>{submission.form_title}</h4>
                  <p>Student: {submission.student_name}</p>
                  <p>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
          <button 
            onClick={() => window.location.href = '/hod/reviews'}
            className="btn-primary"
          >
            View All Reviews
          </button>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => window.location.href = '/hod/create-form'}
              className="btn-primary"
            >
              Create New Form
            </button>
            <button 
              onClick={() => window.location.href = '/hod/forms'}
              className="btn-secondary"
            >
              Manage Forms
            </button>
            <button 
              onClick={() => window.location.href = '/hod/tutors'}
              className="btn-secondary"
            >
              Manage Tutors
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 8. NAVIGATION & ROUTING

### **HOD Navigation Component**
```javascript
const HODNavigation = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="hod-nav">
      <div className="nav-brand">
        <h2>HOD Portal</h2>
      </div>
      
      <div className="nav-links">
        <a href="/hod/dashboard">Dashboard</a>
        <a href="/hod/reviews">Reviews</a>
        <a href="/hod/forms">Forms</a>
        <a href="/hod/tutors">Tutors</a>
        <a href="/hod/profile">Profile</a>
      </div>
      
      <button onClick={handleLogout} className="btn-logout">
        Logout
      </button>
    </nav>
  );
};
```

---

## Key Features Summary

1. **Teacher Management**: View and manage tutors in the department
2. **Form Creation**: Create department-specific forms with custom fields
3. **Submission Reviews**: Review and approve/reject student submissions
4. **Form Management**: Activate/deactivate department forms
5. **Dashboard**: Overview of pending tasks and department statistics
6. **Profile Management**: View HOD profile and department information

## Authentication Notes

- All HOD operations require JWT token with `user_type: "teacher"` and `user_role: "hod"`
- HODs can only manage tutors in their department
- HODs can only create forms for their own department
- HODs review submissions that have been approved by tutors
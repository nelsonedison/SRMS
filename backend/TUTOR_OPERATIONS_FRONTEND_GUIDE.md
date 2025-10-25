# Tutor Operations Frontend Implementation Guide

## Overview
Complete guide for implementing Tutor operations including student management, form submission reviews, and course oversight.

---

---

## 2. TUTOR PROFILE

### **Profile API**
```http
GET /api/teachers/profile/
Authorization: Bearer <tutor_jwt_token>
```

### **Response**
```json
{
  "message": "",
  "id": 3,
  "name": "Prof. John Doe",
  "email": "tutor@icet.ac.in",
  "phone_number": "9876543210",
  "employee_id": "TUT001",
  "role": "tutor",
  "department_id": 1,
  "department_name": "Computer Science and Engineering",
  "course_id": 1,
  "course_name": "Bachelor of Technology",
  "is_active": true
}
```

### **Frontend Profile Component**
```javascript
const TutorProfile = () => {
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
    <div className="tutor-profile">
      <h2>Tutor Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Employee ID:</strong> {profile.employee_id}</p>
        <p><strong>Department:</strong> {profile.department_name}</p>
        <p><strong>Course:</strong> {profile.course_name}</p>
        <p><strong>Role:</strong> {profile.role.toUpperCase()}</p>
      </div>
    </div>
  );
};
```

---

## 3. STUDENT MANAGEMENT

### **List Course Students API**
```http
GET /api/students/list/?course_id=1
Authorization: Bearer <tutor_jwt_token>
```

### **Response**
```json
{
  "message": "",
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@icet.ac.in",
      "college_id": "CS2024001",
      "phone_number": "1234567890",
      "department_name": "Computer Science and Engineering",
      "course_name": "Bachelor of Technology",
      "approval_status": "approved",
      "academic_year_active": true
    }
  ]
}
```

### **Frontend Student Management Component**
```javascript
const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`/api/students/list/?course_id=${user.course}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <div className="student-management">
      <h2>Course Students</h2>
      
      <div className="students-list">
        {students.map(student => (
          <div key={student.id} className="student-card">
            <h3>{student.name}</h3>
            <p><strong>College ID:</strong> {student.college_id}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Phone:</strong> {student.phone_number}</p>
            <p><strong>Status:</strong> 
              <span className={`status ${student.approval_status}`}>
                {student.approval_status}
              </span>
            </p>
            <p><strong>Academic Year:</strong> 
              <span className={student.academic_year_active ? 'active' : 'inactive'}>
                {student.academic_year_active ? 'Active' : 'Expired'}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 4. FORM SUBMISSION REVIEWS

### **List Submissions API**
```http
GET /api/shared/forms/submissions/?status=pending_tutor
Authorization: Bearer <tutor_jwt_token>
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
      "status": "pending_tutor",
      "submitted_at": "2024-01-15T14:30:00Z"
    }
  ]
}
```

### **Review Submission API**
```http
PUT /api/shared/forms/submissions/1/review/
Authorization: Bearer <tutor_jwt_token>
Content-Type: application/json
```

### **Request**
```json
{
  "action": "approve",
  "comments": "Leave approved by tutor"
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
      const response = await fetch('/api/shared/forms/submissions/?status=pending_tutor', {
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
      <h2>Pending Tutor Reviews</h2>
      
      <div className="submissions-list">
        {submissions.length === 0 ? (
          <p>No submissions pending your review</p>
        ) : (
          submissions.map(submission => (
            <div key={submission.id} className="submission-card">
              <div className="submission-header">
                <h3>{submission.form_title}</h3>
                <span className="status pending">Pending Tutor Review</span>
              </div>
              
              <div className="submission-info">
                <p><strong>Student:</strong> {submission.student_name} ({submission.student_college_id})</p>
                <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
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

## 5. AVAILABLE FORMS

### **List Available Forms API**
```http
GET /api/shared/forms/
Authorization: Bearer <tutor_jwt_token>
```

### **Frontend Forms List Component**
```javascript
const AvailableForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/shared/forms/', {
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

  if (loading) return <div>Loading forms...</div>;

  return (
    <div className="available-forms">
      <h2>Available Forms</h2>
      
      <div className="forms-list">
        {forms.map(form => (
          <div key={form.id} className="form-card">
            <div className="form-header">
              <h3>{form.title}</h3>
              <span className="status active">Active</span>
            </div>
            
            <p className="form-description">{form.description}</p>
            
            <div className="form-meta">
              <p><strong>Department:</strong> {form.department_name || 'All Departments'}</p>
              <p><strong>Created:</strong> {new Date(form.created_at).toLocaleDateString()}</p>
              <p><strong>Fields:</strong> {form.fields.length}</p>
            </div>

            <div className="form-actions">
              <button
                onClick={() => window.location.href = `/forms/${form.id}`}
                className="btn-primary"
              >
                View Form
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

## 6. TUTOR DASHBOARD

### **Frontend Dashboard Component**
```javascript
const TutorDashboard = () => {
  const [stats, setStats] = useState({
    pendingReviews: 0,
    courseStudents: 0,
    availableForms: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending reviews
      const reviewsResponse = await fetch('/api/shared/forms/submissions/?status=pending_tutor', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const reviewsData = await reviewsResponse.json();
      
      // Fetch course students
      const user = JSON.parse(localStorage.getItem('user'));
      const studentsResponse = await fetch(`/api/students/list/?course_id=${user.course}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const studentsData = await studentsResponse.json();
      
      // Fetch available forms
      const formsResponse = await fetch('/api/shared/forms/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const formsData = await formsResponse.json();

      setStats({
        pendingReviews: reviewsData.submissions?.length || 0,
        courseStudents: studentsData.students?.length || 0,
        availableForms: formsData.forms?.length || 0
      });

      setRecentSubmissions(reviewsData.submissions?.slice(0, 5) || []);
    } catch (error) {
      console.error('Failed to load dashboard data');
    }
  };

  return (
    <div className="tutor-dashboard">
      <h1>Tutor Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Pending Reviews</h3>
          <div className="stat-number">{stats.pendingReviews}</div>
        </div>
        
        <div className="stat-card">
          <h3>Course Students</h3>
          <div className="stat-number">{stats.courseStudents}</div>
        </div>
        
        <div className="stat-card">
          <h3>Available Forms</h3>
          <div className="stat-number">{stats.availableForms}</div>
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
            onClick={() => window.location.href = '/tutor/reviews'}
            className="btn-primary"
          >
            View All Reviews
          </button>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => window.location.href = '/tutor/students'}
              className="btn-primary"
            >
              View Students
            </button>
            <button 
              onClick={() => window.location.href = '/tutor/forms'}
              className="btn-secondary"
            >
              View Forms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 7. NAVIGATION & ROUTING

### **Tutor Navigation Component**
```javascript
const TutorNavigation = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="tutor-nav">
      <div className="nav-brand">
        <h2>Tutor Portal</h2>
      </div>
      
      <div className="nav-links">
        <a href="/tutor/dashboard">Dashboard</a>
        <a href="/tutor/reviews">Reviews</a>
        <a href="/tutor/students">Students</a>
        <a href="/tutor/forms">Forms</a>
        <a href="/tutor/profile">Profile</a>
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

1. **Student Management**: View and monitor course students
2. **Submission Reviews**: First-level approval in the hierarchical system (Student → **Tutor** → HOD → Principal)
3. **Form Access**: View department and common forms available to students
4. **Dashboard**: Overview of pending tasks and course statistics
5. **Profile Management**: View tutor profile and course assignment

## Authentication Notes

- All tutor operations require JWT token with `user_type: "teacher"` and `user_role: "tutor"`
- Tutors can only see students from their assigned course
- Tutors review submissions from students in their course
- Tutors can view department-specific and common forms
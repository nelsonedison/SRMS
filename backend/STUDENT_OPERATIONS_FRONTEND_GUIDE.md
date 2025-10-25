# Student Operations Frontend Implementation Guide

## Overview
Complete guide for implementing student-related operations including registration, login, profile management, form submissions, and approval tracking.

---

## 1. STUDENT REGISTRATION

### **Registration API**
```http
POST /api/students/register/
Content-Type: application/json
```

### **Request Structure**
```json
{
  "name": "John Doe",
  "phone_number": "1234567890",
  "email": "john@icet.ac.in",
  "address": "123 Main Street, City",
  "college_id": "CS2024001",
  "department": 1,
  "course": 1,
  "password": "securepassword123"
}
```

### **Response**
```json
{
  "message": "Registration submitted successfully! Please wait for admin approval.",
  "student_id": 1,
  "college_id": "CS2024001"
}
```

### **Frontend Registration Component**
```javascript
const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    address: '',
    college_id: '',
    department: '',
    course: '',
    password: '',
    confirmPassword: ''
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchCourses(formData.department);
    }
  }, [formData.department]);

  const fetchDepartments = async () => {
    const response = await fetch('/api/shared/departments/');
    const data = await response.json();
    setDepartments(data.departments);
  };

  const fetchCourses = async (departmentId) => {
    const response = await fetch(`/api/shared/courses/?department_id=${departmentId}`);
    const data = await response.json();
    setCourses(data.courses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/students/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone_number,
          email: formData.email,
          address: formData.address,
          college_id: formData.college_id,
          department: parseInt(formData.department),
          course: parseInt(formData.course),
          password: formData.password
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Registration successful! Please wait for approval.');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        alert(result.error || 'Registration failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone_number}
        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
        required
      />
      
      <input
        type="email"
        placeholder="Email (@icet.ac.in)"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        pattern=".*@icet\.ac\.in$"
        required
      />
      
      <textarea
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value})}
        required
      />
      
      <input
        type="text"
        placeholder="College ID"
        value={formData.college_id}
        onChange={(e) => setFormData({...formData, college_id: e.target.value})}
        required
      />
      
      <select
        value={formData.department}
        onChange={(e) => setFormData({...formData, department: e.target.value, course: ''})}
        required
      >
        <option value="">Select Department</option>
        {departments.map(dept => (
          <option key={dept.id} value={dept.id}>{dept.name}</option>
        ))}
      </select>
      
      <select
        value={formData.course}
        onChange={(e) => setFormData({...formData, course: e.target.value})}
        required
        disabled={!formData.department}
      >
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>
      
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        minLength="8"
        required
      />
      
      <input
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

---

## 2. STUDENT LOGIN (Common Login)

### **Login API**
```http
POST /api/shared/login/
Content-Type: application/json
```

### **Request**
```json
{
  "email": "john@icet.ac.in",
  "password": "securepassword123"
}
```

### **Response**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_type": "student",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@icet.ac.in",
    "college_id": "CS2024001",
    "department": 1,
    "course": 1,
    "academic_year_active": true
  }
}
```

### **Frontend Login Component**
```javascript
const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/shared/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const result = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('token', result.token);
        localStorage.setItem('userType', result.user_type);
        localStorage.setItem('user', JSON.stringify(result.user));

        // Redirect based on user type
        switch (result.user_type) {
          case 'student':
            window.location.href = '/student-dashboard';
            break;
          case 'teacher':
            window.location.href = '/teacher-dashboard';
            break;
          case 'admin':
            window.location.href = '/admin-dashboard';
            break;
        }
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## 3. STUDENT PROFILE

### **Profile API**
```http
GET /api/students/profile/
Authorization: Bearer <student_jwt_token>
```

### **Response**
```json
{
  "message": "",
  "id": 1,
  "name": "John Doe",
  "email": "john@icet.ac.in",
  "phone_number": "1234567890",
  "address": "123 Main Street, City",
  "college_id": "CS2024001",
  "department_id": 1,
  "department_name": "Computer Science and Engineering",
  "course_id": 1,
  "course_name": "Bachelor of Technology",
  "academic_year_start": "2024-01-01",
  "academic_year_end": "2024-12-31",
  "academic_year_active": true
}
```

### **Frontend Profile Component**
```javascript
const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/students/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        alert('Failed to load profile');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="profile-container">
      <h2>Student Profile</h2>
      
      <div className="profile-section">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phone_number}</p>
        <p><strong>Address:</strong> {profile.address}</p>
        <p><strong>College ID:</strong> {profile.college_id}</p>
      </div>

      <div className="profile-section">
        <h3>Academic Information</h3>
        <p><strong>Department:</strong> {profile.department_name}</p>
        <p><strong>Course:</strong> {profile.course_name}</p>
        <p><strong>Academic Year:</strong> {profile.academic_year_start} to {profile.academic_year_end}</p>
        <p><strong>Status:</strong> 
          <span className={profile.academic_year_active ? 'active' : 'inactive'}>
            {profile.academic_year_active ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
    </div>
  );
};
```

---

## 4. FORM SUBMISSIONS

### **Available Forms API**
```http
GET /api/shared/forms/
GET /api/shared/forms/?department_id=1
```

### **Submit Form API**
```http
POST /api/shared/forms/1/submit/
Authorization: Bearer <student_jwt_token>
Content-Type: application/json
```

### **My Submissions API**
```http
GET /api/shared/submissions/my/
Authorization: Bearer <student_jwt_token>
```

### **Frontend Form Submission Component**
```javascript
const StudentForms = () => {
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    fetchForms();
    fetchMySubmissions();
  }, []);

  const fetchForms = async () => {
    const response = await fetch('/api/shared/forms/');
    const data = await response.json();
    setForms(data.forms);
  };

  const fetchMySubmissions = async () => {
    const response = await fetch('/api/shared/submissions/my/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    setSubmissions(data.submissions);
  };

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
      case 'pending_tutor': return 'Pending Tutor Review';
      case 'pending_hod': return 'Pending HOD Review';
      case 'pending_principal': return 'Pending Principal Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  return (
    <div className="student-forms">
      <div className="tabs">
        <button 
          className={activeTab === 'available' ? 'active' : ''}
          onClick={() => setActiveTab('available')}
        >
          Available Forms
        </button>
        <button 
          className={activeTab === 'submissions' ? 'active' : ''}
          onClick={() => setActiveTab('submissions')}
        >
          My Submissions
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="available-forms">
          <h3>Available Forms</h3>
          {forms.map(form => (
            <div key={form.id} className="form-card">
              <h4>{form.title}</h4>
              <p>{form.description}</p>
              <p><strong>Department:</strong> {form.department_name}</p>
              <button onClick={() => window.location.href = `/forms/${form.id}`}>
                Fill Form
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="my-submissions">
          <h3>My Submissions</h3>
          {submissions.map(submission => (
            <div key={submission.id} className="submission-card">
              <h4>{submission.form_title}</h4>
              <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> 
                <span style={{ color: getStatusColor(submission.status) }}>
                  {getStatusText(submission.status)}
                </span>
              </p>
              
              {/* Approval Timeline */}
              <div className="approval-timeline">
                <div className={`step ${submission.tutor_reviewed_at ? 'completed' : ''}`}>
                  <span>Tutor</span>
                  {submission.tutor_reviewed_at && <span>✓</span>}
                </div>
                <div className={`step ${submission.hod_reviewed_at ? 'completed' : ''}`}>
                  <span>HOD</span>
                  {submission.hod_reviewed_at && <span>✓</span>}
                </div>
                <div className={`step ${submission.principal_reviewed_at ? 'completed' : ''}`}>
                  <span>Principal</span>
                  {submission.principal_reviewed_at && <span>✓</span>}
                </div>
              </div>

              {/* Comments */}
              {submission.tutor_comments && (
                <p><strong>Tutor Comments:</strong> {submission.tutor_comments}</p>
              )}
              {submission.hod_comments && (
                <p><strong>HOD Comments:</strong> {submission.hod_comments}</p>
              )}
              {submission.principal_comments && (
                <p><strong>Principal Comments:</strong> {submission.principal_comments}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 5. STUDENT DASHBOARD

### **Complete Dashboard Component**
```javascript
const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/shared/submissions/my/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const submissions = data.submissions;
        
        setStats({
          totalSubmissions: submissions.length,
          pendingSubmissions: submissions.filter(s => 
            s.status.includes('pending')).length,
          approvedSubmissions: submissions.filter(s => 
            s.status === 'approved').length,
          rejectedSubmissions: submissions.filter(s => 
            s.status === 'rejected').length
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalSubmissions}</h3>
          <p>Total Submissions</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingSubmissions}</h3>
          <p>Pending Review</p>
        </div>
        <div className="stat-card">
          <h3>{stats.approvedSubmissions}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card">
          <h3>{stats.rejectedSubmissions}</h3>
          <p>Rejected</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => window.location.href = '/forms'}>
          Browse Forms
        </button>
        <button onClick={() => window.location.href = '/profile'}>
          View Profile
        </button>
        <button onClick={() => window.location.href = '/submissions'}>
          My Submissions
        </button>
      </div>
    </div>
  );
};
```

---

## 6. AUTHENTICATION GUARD

### **Protected Route Component**
```javascript
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <div>Access Denied</div>;
  }

  return children;
};

// Usage
<ProtectedRoute allowedRoles={['student']}>
  <StudentDashboard />
</ProtectedRoute>
```

---

## 7. ERROR HANDLING

### **Common Error Messages**
- `"Registration is pending approval"` - Student not yet approved
- `"Registration has been rejected"` - Student registration rejected  
- `"Academic year has expired"` - Student's academic year ended
- `"Account is inactive"` - Student account deactivated
- `"Invalid credentials"` - Wrong email/password

### **Error Handler Utility**
```javascript
const handleApiError = (error, response) => {
  if (response?.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
  } else if (response?.status === 403) {
    alert('Access denied. You do not have permission for this action.');
  } else if (error.message) {
    alert(error.message);
  } else {
    alert('An error occurred. Please try again.');
  }
};
```

This guide provides complete implementation examples for all student operations with proper error handling, validation, and user experience considerations.
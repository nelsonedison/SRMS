# Principal Operations Frontend Implementation Guide

## Overview
Complete guide for implementing principal-specific operations including teacher management, student approvals, department/course management, form creation, and submission reviews.

---

## 1. PRINCIPAL DASHBOARD

### **Dashboard Stats API**
```http
GET /api/teachers/list/
GET /api/students/pending/
GET /api/students/approved/
GET /api/shared/submissions/
Authorization: Bearer <principal_jwt_token>
```

### **Frontend Dashboard Component**
```javascript
const PrincipalDashboard = () => {
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalHODs: 0,
    totalTutors: 0,
    pendingStudents: 0,
    approvedStudents: 0,
    pendingSubmissions: 0
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch teachers
      const teachersRes = await fetch('/api/teachers/list/', { headers });
      const teachersData = await teachersRes.json();
      const teachers = teachersData.teachers || [];

      // Fetch pending students
      const pendingRes = await fetch('/api/students/pending/', { headers });
      const pendingData = await pendingRes.json();

      // Fetch approved students
      const approvedRes = await fetch('/api/students/approved/', { headers });
      const approvedData = await approvedRes.json();

      // Fetch pending submissions
      const submissionsRes = await fetch('/api/shared/submissions/', { headers });
      const submissionsData = await submissionsRes.json();

      setStats({
        totalTeachers: teachers.length,
        totalHODs: teachers.filter(t => t.role === 'hod').length,
        totalTutors: teachers.filter(t => t.role === 'tutor').length,
        pendingStudents: pendingData.students?.length || 0,
        approvedStudents: approvedData.students?.length || 0,
        pendingSubmissions: submissionsData.submissions?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats');
    }
  };

  return (
    <div className="principal-dashboard">
      <header className="dashboard-header">
        <h1>Principal Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => logout()}>Logout</button>
        </div>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalTeachers}</h3>
          <p>Total Teachers</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalHODs}</h3>
          <p>HODs</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalTutors}</h3>
          <p>Tutors</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingStudents}</h3>
          <p>Pending Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.approvedStudents}</h3>
          <p>Approved Students</p>
        </div>
        <div className="stat-card">
          <h3>{stats.pendingSubmissions}</h3>
          <p>Pending Reviews</p>
        </div>
      </div>

      <div className="quick-actions">
        <button onClick={() => window.location.href = '/teachers'}>
          Manage Teachers
        </button>
        <button onClick={() => window.location.href = '/students'}>
          Manage Students
        </button>
        <button onClick={() => window.location.href = '/departments'}>
          Manage Departments
        </button>
        <button onClick={() => window.location.href = '/forms'}>
          Manage Forms
        </button>
        <button onClick={() => window.location.href = '/submissions'}>
          Review Submissions
        </button>
      </div>
    </div>
  );
};
```

---

## 2. TEACHER MANAGEMENT

### **List Teachers API**
```http
GET /api/teachers/list/
Authorization: Bearer <principal_jwt_token>
```

### **Update Teacher API**
```http
PUT /api/teachers/1/update/
Authorization: Bearer <principal_jwt_token>
Content-Type: application/json
```

### **Deactivate Teacher API**
```http
DELETE /api/teachers/1/deactivate/
Authorization: Bearer <principal_jwt_token>
```

### **Frontend Teacher Management Component**
```javascript
const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers/list/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      alert('Failed to fetch teachers');
    }
  };

  const fetchDepartments = async () => {
    const response = await fetch('/api/shared/departments/');
    const data = await response.json();
    setDepartments(data.departments || []);
  };

  const fetchCourses = async (departmentId) => {
    const response = await fetch(`/api/shared/courses/?department_id=${departmentId}`);
    const data = await response.json();
    setCourses(data.courses || []);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher({...teacher});
    if (teacher.department_id) {
      fetchCourses(teacher.department_id);
    }
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/teachers/${selectedTeacher.id}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedTeacher.name,
          email: selectedTeacher.email,
          phone_number: selectedTeacher.phone_number,
          department: selectedTeacher.department_id,
          course: selectedTeacher.course_id,
          is_active: selectedTeacher.is_active
        })
      });

      if (response.ok) {
        alert('Teacher updated successfully');
        setShowEditModal(false);
        fetchTeachers();
      } else {
        alert('Failed to update teacher');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleDeactivate = async (teacherId) => {
    if (confirm('Are you sure you want to deactivate this teacher?')) {
      try {
        const response = await fetch(`/api/teachers/${teacherId}/deactivate/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
          alert('Teacher deactivated successfully');
          fetchTeachers();
        } else {
          alert('Failed to deactivate teacher');
        }
      } catch (error) {
        alert('Network error');
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'hod': return '#2196f3';
      case 'tutor': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <div className="teacher-management">
      <h2>Teacher Management</h2>
      
      <div className="teachers-grid">
        {teachers.map(teacher => (
          <div key={teacher.id} className="teacher-card">
            <div className="teacher-info">
              <h3>{teacher.name}</h3>
              <p><strong>Employee ID:</strong> {teacher.employee_id}</p>
              <p><strong>Email:</strong> {teacher.email}</p>
              <p><strong>Role:</strong> 
                <span 
                  className="role-badge" 
                  style={{ backgroundColor: getRoleBadgeColor(teacher.role) }}
                >
                  {teacher.role.toUpperCase()}
                </span>
              </p>
              <p><strong>Department:</strong> {teacher.department_name || 'N/A'}</p>
              <p><strong>Course:</strong> {teacher.course_name || 'N/A'}</p>
              <p><strong>Status:</strong> 
                <span className={teacher.is_active ? 'active' : 'inactive'}>
                  {teacher.is_active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            
            <div className="teacher-actions">
              <button onClick={() => handleEdit(teacher)}>Edit</button>
              <button 
                onClick={() => handleDeactivate(teacher.id)}
                className="danger"
                disabled={!teacher.is_active}
              >
                Deactivate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Teacher</h3>
            
            <input
              type="text"
              placeholder="Name"
              value={selectedTeacher.name}
              onChange={(e) => setSelectedTeacher({
                ...selectedTeacher, 
                name: e.target.value
              })}
            />
            
            <input
              type="email"
              placeholder="Email"
              value={selectedTeacher.email}
              onChange={(e) => setSelectedTeacher({
                ...selectedTeacher, 
                email: e.target.value
              })}
            />
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={selectedTeacher.phone_number}
              onChange={(e) => setSelectedTeacher({
                ...selectedTeacher, 
                phone_number: e.target.value
              })}
            />
            
            <select
              value={selectedTeacher.department_id || ''}
              onChange={(e) => {
                const deptId = e.target.value;
                setSelectedTeacher({
                  ...selectedTeacher, 
                  department_id: deptId,
                  course_id: ''
                });
                if (deptId) fetchCourses(deptId);
              }}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            
            {selectedTeacher.role === 'tutor' && (
              <select
                value={selectedTeacher.course_id || ''}
                onChange={(e) => setSelectedTeacher({
                  ...selectedTeacher, 
                  course_id: e.target.value
                })}
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>
            )}
            
            <label>
              <input
                type="checkbox"
                checked={selectedTeacher.is_active}
                onChange={(e) => setSelectedTeacher({
                  ...selectedTeacher, 
                  is_active: e.target.checked
                })}
              />
              Active
            </label>
            
            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 3. STUDENT APPROVAL MANAGEMENT

### **Pending Students API**
```http
GET /api/students/pending/
Authorization: Bearer <principal_jwt_token>
```

### **Approve Student API**
```http
PUT /api/students/1/approve/
Authorization: Bearer <principal_jwt_token>
Content-Type: application/json
```

### **Frontend Student Approval Component**
```javascript
const StudentApproval = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [academicYear, setAcademicYear] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchPendingStudents();
    fetchApprovedStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await fetch('/api/students/pending/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPendingStudents(data.students || []);
    } catch (error) {
      alert('Failed to fetch pending students');
    }
  };

  const fetchApprovedStudents = async () => {
    try {
      const response = await fetch('/api/students/approved/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setApprovedStudents(data.students || []);
    } catch (error) {
      alert('Failed to fetch approved students');
    }
  };

  const handleApprove = (student) => {
    setSelectedStudent(student);
    setShowApprovalModal(true);
  };

  const handleReject = async (studentId) => {
    if (confirm('Are you sure you want to reject this student?')) {
      try {
        const response = await fetch(`/api/students/${studentId}/approve/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action: 'reject' })
        });

        if (response.ok) {
          alert('Student rejected successfully');
          fetchPendingStudents();
        } else {
          alert('Failed to reject student');
        }
      } catch (error) {
        alert('Network error');
      }
    }
  };

  const submitApproval = async () => {
    try {
      const response = await fetch(`/api/students/${selectedStudent.id}/approve/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'approve',
          academic_year_start: academicYear.start,
          academic_year_end: academicYear.end
        })
      });

      if (response.ok) {
        alert('Student approved successfully');
        setShowApprovalModal(false);
        fetchPendingStudents();
        fetchApprovedStudents();
      } else {
        alert('Failed to approve student');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="student-approval">
      <h2>Student Management</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending Approval ({pendingStudents.length})
        </button>
        <button 
          className={activeTab === 'approved' ? 'active' : ''}
          onClick={() => setActiveTab('approved')}
        >
          Approved Students ({approvedStudents.length})
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="pending-students">
          {pendingStudents.map(student => (
            <div key={student.id} className="student-card">
              <div className="student-info">
                <h3>{student.name}</h3>
                <p><strong>College ID:</strong> {student.college_id}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone_number}</p>
                <p><strong>Department:</strong> {student.department_name}</p>
                <p><strong>Course:</strong> {student.course_name}</p>
                <p><strong>Address:</strong> {student.address}</p>
                <p><strong>Applied:</strong> {new Date(student.created_at).toLocaleDateString()}</p>
              </div>
              
              <div className="student-actions">
                <button 
                  onClick={() => handleApprove(student)}
                  className="approve"
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleReject(student.id)}
                  className="reject"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="approved-students">
          {approvedStudents.map(student => (
            <div key={student.id} className="student-card approved">
              <div className="student-info">
                <h3>{student.name}</h3>
                <p><strong>College ID:</strong> {student.college_id}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Department:</strong> {student.department_name}</p>
                <p><strong>Course:</strong> {student.course_name}</p>
                <p><strong>Academic Year:</strong> {student.academic_year_start} to {student.academic_year_end}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Approve Student: {selectedStudent?.name}</h3>
            
            <div className="form-group">
              <label>Academic Year Start Date:</label>
              <input
                type="date"
                value={academicYear.start}
                onChange={(e) => setAcademicYear({
                  ...academicYear, 
                  start: e.target.value
                })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Academic Year End Date:</label>
              <input
                type="date"
                value={academicYear.end}
                onChange={(e) => setAcademicYear({
                  ...academicYear, 
                  end: e.target.value
                })}
                required
              />
            </div>
            
            <div className="modal-actions">
              <button onClick={submitApproval}>Approve Student</button>
              <button onClick={() => setShowApprovalModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 4. DEPARTMENT & COURSE MANAGEMENT

### **Create Department API**
```http
POST /api/shared/departments/create/
Authorization: Bearer <principal_jwt_token>
Content-Type: application/json
```

### **Create Course API**
```http
POST /api/shared/courses/create/
Authorization: Bearer <principal_jwt_token>
Content-Type: application/json
```

### **Frontend Department Management Component**
```javascript
const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    department: '',
    description: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  const fetchDepartments = async () => {
    const response = await fetch('/api/shared/departments/');
    const data = await response.json();
    setDepartments(data.departments || []);
  };

  const fetchCourses = async () => {
    const response = await fetch('/api/shared/courses/');
    const data = await response.json();
    setCourses(data.courses || []);
  };

  const createDepartment = async () => {
    try {
      const response = await fetch('/api/shared/departments/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDepartment)
      });

      if (response.ok) {
        alert('Department created successfully');
        setShowDeptModal(false);
        setNewDepartment({ name: '', code: '', description: '' });
        fetchDepartments();
      } else {
        alert('Failed to create department');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const createCourse = async () => {
    try {
      const response = await fetch('/api/shared/courses/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newCourse,
          department: parseInt(newCourse.department)
        })
      });

      if (response.ok) {
        alert('Course created successfully');
        setShowCourseModal(false);
        setNewCourse({ name: '', code: '', department: '', description: '' });
        fetchCourses();
      } else {
        alert('Failed to create course');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="department-management">
      <h2>Department & Course Management</h2>
      
      <div className="management-actions">
        <button onClick={() => setShowDeptModal(true)}>
          Create Department
        </button>
        <button onClick={() => setShowCourseModal(true)}>
          Create Course
        </button>
      </div>

      <div className="departments-section">
        <h3>Departments ({departments.length})</h3>
        <div className="departments-grid">
          {departments.map(dept => (
            <div key={dept.id} className="department-card">
              <h4>{dept.name}</h4>
              <p><strong>Code:</strong> {dept.code}</p>
              <p><strong>Description:</strong> {dept.description}</p>
              <p><strong>Created by:</strong> {dept.created_by_name}</p>
              <p><strong>Courses:</strong> {courses.filter(c => c.department === dept.id).length}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="courses-section">
        <h3>Courses ({courses.length})</h3>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h4>{course.name}</h4>
              <p><strong>Code:</strong> {course.code}</p>
              <p><strong>Department:</strong> {course.department_name}</p>
              <p><strong>Description:</strong> {course.description}</p>
              <p><strong>Created by:</strong> {course.created_by_name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Modal */}
      {showDeptModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Department</h3>
            
            <input
              type="text"
              placeholder="Department Name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({
                ...newDepartment, 
                name: e.target.value
              })}
            />
            
            <input
              type="text"
              placeholder="Department Code (e.g., CSE)"
              value={newDepartment.code}
              onChange={(e) => setNewDepartment({
                ...newDepartment, 
                code: e.target.value.toUpperCase()
              })}
            />
            
            <textarea
              placeholder="Description"
              value={newDepartment.description}
              onChange={(e) => setNewDepartment({
                ...newDepartment, 
                description: e.target.value
              })}
            />
            
            <div className="modal-actions">
              <button onClick={createDepartment}>Create</button>
              <button onClick={() => setShowDeptModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create Course</h3>
            
            <input
              type="text"
              placeholder="Course Name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({
                ...newCourse, 
                name: e.target.value
              })}
            />
            
            <input
              type="text"
              placeholder="Course Code (e.g., BTECH)"
              value={newCourse.code}
              onChange={(e) => setNewCourse({
                ...newCourse, 
                code: e.target.value.toUpperCase()
              })}
            />
            
            <select
              value={newCourse.department}
              onChange={(e) => setNewCourse({
                ...newCourse, 
                department: e.target.value
              })}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            
            <textarea
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({
                ...newCourse, 
                description: e.target.value
              })}
            />
            
            <div className="modal-actions">
              <button onClick={createCourse}>Create</button>
              <button onClick={() => setShowCourseModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 5. FORM MANAGEMENT

### **Create Form API**
```http
POST /api/shared/forms/create/
Authorization: Bearer <principal_jwt_token>
Content-Type: application/json
```

### **Frontend Form Management Component**
```javascript
const FormManagement = () => {
  const [forms, setForms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    department: '',
    fields: []
  });

  useEffect(() => {
    fetchForms();
    fetchDepartments();
  }, []);

  const fetchForms = async () => {
    const response = await fetch('/api/shared/forms/');
    const data = await response.json();
    setForms(data.forms || []);
  };

  const fetchDepartments = async () => {
    const response = await fetch('/api/shared/departments/');
    const data = await response.json();
    setDepartments(data.departments || []);
  };

  const addField = (fieldType) => {
    const newField = {
      label: '',
      field_type: fieldType,
      is_required: false,
      placeholder: '',
      options: ['select', 'radio', 'checkbox'].includes(fieldType) ? [''] : [],
      order: newForm.fields.length + 1
    };
    setNewForm({
      ...newForm,
      fields: [...newForm.fields, newField]
    });
  };

  const updateField = (index, property, value) => {
    const updatedFields = [...newForm.fields];
    updatedFields[index][property] = value;
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const removeField = (index) => {
    const updatedFields = newForm.fields.filter((_, i) => i !== index);
    setNewForm({ ...newForm, fields: updatedFields });
  };

  const createForm = async () => {
    try {
      const response = await fetch('/api/shared/forms/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newForm,
          department: parseInt(newForm.department)
        })
      });

      if (response.ok) {
        alert('Form created successfully');
        setShowCreateModal(false);
        setNewForm({ title: '', description: '', department: '', fields: [] });
        fetchForms();
      } else {
        alert('Failed to create form');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const deleteForm = async (formId) => {
    if (confirm('Are you sure you want to delete this form?')) {
      try {
        const response = await fetch(`/api/shared/forms/${formId}/delete/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
          alert('Form deleted successfully');
          fetchForms();
        } else {
          alert('Failed to delete form');
        }
      } catch (error) {
        alert('Network error');
      }
    }
  };

  return (
    <div className="form-management">
      <h2>Form Management</h2>
      
      <button onClick={() => setShowCreateModal(true)}>
        Create New Form
      </button>

      <div className="forms-grid">
        {forms.map(form => (
          <div key={form.id} className="form-card">
            <h3>{form.title}</h3>
            <p>{form.description}</p>
            <p><strong>Department:</strong> {form.department_name}</p>
            <p><strong>Fields:</strong> {form.fields.length}</p>
            <p><strong>Created by:</strong> {form.created_by_name}</p>
            <p><strong>Status:</strong> {form.is_active ? 'Active' : 'Inactive'}</p>
            
            <div className="form-actions">
              <button onClick={() => window.location.href = `/forms/${form.id}`}>
                View
              </button>
              <button onClick={() => deleteForm(form.id)} className="danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form Modal */}
      {showCreateModal && (
        <div className="modal large">
          <div className="modal-content">
            <h3>Create New Form</h3>
            
            <input
              type="text"
              placeholder="Form Title"
              value={newForm.title}
              onChange={(e) => setNewForm({...newForm, title: e.target.value})}
            />
            
            <textarea
              placeholder="Form Description"
              value={newForm.description}
              onChange={(e) => setNewForm({...newForm, description: e.target.value})}
            />
            
            <select
              value={newForm.department}
              onChange={(e) => setNewForm({...newForm, department: e.target.value})}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>

            <div className="field-builder">
              <h4>Form Fields</h4>
              
              <div className="field-types">
                <button onClick={() => addField('text')}>Add Text</button>
                <button onClick={() => addField('textarea')}>Add Textarea</button>
                <button onClick={() => addField('select')}>Add Dropdown</button>
                <button onClick={() => addField('radio')}>Add Radio</button>
                <button onClick={() => addField('checkbox')}>Add Checkbox</button>
                <button onClick={() => addField('date')}>Add Date</button>
                <button onClick={() => addField('number')}>Add Number</button>
                <button onClick={() => addField('email')}>Add Email</button>
              </div>

              {newForm.fields.map((field, index) => (
                <div key={index} className="field-editor">
                  <input
                    type="text"
                    placeholder="Field Label"
                    value={field.label}
                    onChange={(e) => updateField(index, 'label', e.target.value)}
                  />
                  
                  <input
                    type="text"
                    placeholder="Placeholder"
                    value={field.placeholder}
                    onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                  />
                  
                  <label>
                    <input
                      type="checkbox"
                      checked={field.is_required}
                      onChange={(e) => updateField(index, 'is_required', e.target.checked)}
                    />
                    Required
                  </label>

                  {['select', 'radio', 'checkbox'].includes(field.field_type) && (
                    <div className="options-editor">
                      <p>Options:</p>
                      {field.options.map((option, optIndex) => (
                        <input
                          key={optIndex}
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...field.options];
                            newOptions[optIndex] = e.target.value;
                            updateField(index, 'options', newOptions);
                          }}
                        />
                      ))}
                      <button onClick={() => {
                        const newOptions = [...field.options, ''];
                        updateField(index, 'options', newOptions);
                      }}>
                        Add Option
                      </button>
                    </div>
                  )}
                  
                  <button onClick={() => removeField(index)} className="danger">
                    Remove Field
                  </button>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button onClick={createForm}>Create Form</button>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 6. SUBMISSION REVIEWS

### **Pending Submissions API**
```http
GET /api/shared/submissions/
Authorization: Bearer <principal_jwt_token>
```

### **Review Submission API**
```http
PUT /api/shared/submissions/1/review/
Authorization: Bearer <principal_jwt_token>
Content-Type: application/json
```

### **Frontend Submission Review Component**
```javascript
const SubmissionReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    action: '',
    comments: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/shared/submissions/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (error) {
      alert('Failed to fetch submissions');
    }
  };

  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      const response = await fetch(`/api/shared/submissions/${selectedSubmission.id}/review/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        alert(`Submission ${reviewData.action}d successfully`);
        setShowReviewModal(false);
        setReviewData({ action: '', comments: '' });
        fetchSubmissions();
      } else {
        alert('Failed to review submission');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_principal': return '#9c27b0';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <div className="submission-review">
      <h2>Submission Reviews</h2>
      
      <div className="submissions-grid">
        {submissions.map(submission => (
          <div key={submission.id} className="submission-card">
            <h3>{submission.form_title}</h3>
            <p><strong>Student:</strong> {submission.student_name} ({submission.student_college_id})</p>
            <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> 
              <span style={{ color: getStatusColor(submission.status) }}>
                {submission.status.replace('_', ' ').toUpperCase()}
              </span>
            </p>

            {/* Approval Timeline */}
            <div className="approval-timeline">
              <div className={`step ${submission.tutor_reviewed_at ? 'completed' : ''}`}>
                <span>Tutor ✓</span>
                {submission.tutor_comments && (
                  <p className="comment">"{submission.tutor_comments}"</p>
                )}
              </div>
              <div className={`step ${submission.hod_reviewed_at ? 'completed' : ''}`}>
                <span>HOD ✓</span>
                {submission.hod_comments && (
                  <p className="comment">"{submission.hod_comments}"</p>
                )}
              </div>
              <div className={`step ${submission.principal_reviewed_at ? 'completed' : ''}`}>
                <span>Principal</span>
                {submission.principal_comments && (
                  <p className="comment">"{submission.principal_comments}"</p>
                )}
              </div>
            </div>

            {/* Submission Data */}
            <div className="submission-data">
              <h4>Submitted Data:</h4>
              {Object.entries(submission.data).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>

            {submission.status === 'pending_principal' && (
              <div className="submission-actions">
                <button 
                  onClick={() => handleReview(submission)}
                  className="review"
                >
                  Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Review Submission</h3>
            <p><strong>Form:</strong> {selectedSubmission?.form_title}</p>
            <p><strong>Student:</strong> {selectedSubmission?.student_name}</p>
            
            <div className="review-actions">
              <label>
                <input
                  type="radio"
                  name="action"
                  value="approve"
                  onChange={(e) => setReviewData({
                    ...reviewData, 
                    action: e.target.value
                  })}
                />
                Approve
              </label>
              <label>
                <input
                  type="radio"
                  name="action"
                  value="reject"
                  onChange={(e) => setReviewData({
                    ...reviewData, 
                    action: e.target.value
                  })}
                />
                Reject
              </label>
            </div>
            
            <textarea
              placeholder="Comments (optional)"
              value={reviewData.comments}
              onChange={(e) => setReviewData({
                ...reviewData, 
                comments: e.target.value
              })}
            />
            
            <div className="modal-actions">
              <button 
                onClick={submitReview}
                disabled={!reviewData.action}
              >
                Submit Review
              </button>
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 7. NAVIGATION & LAYOUT

### **Principal Navigation Component**
```javascript
const PrincipalLayout = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="principal-layout">
      <nav className="sidebar">
        <div className="nav-header">
          <h2>Principal Panel</h2>
          <p>{user?.name}</p>
        </div>
        
        <ul className="nav-menu">
          <li><a href="/principal/dashboard">Dashboard</a></li>
          <li><a href="/principal/teachers">Manage Teachers</a></li>
          <li><a href="/principal/students">Manage Students</a></li>
          <li><a href="/principal/departments">Departments & Courses</a></li>
          <li><a href="/principal/forms">Manage Forms</a></li>
          <li><a href="/principal/submissions">Review Submissions</a></li>
        </ul>
        
        <button onClick={logout} className="logout-btn">Logout</button>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
```

This guide provides complete implementation for all principal operations with proper error handling, validation, and user experience considerations.
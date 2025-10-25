import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./contexts/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layouts
import AdminLayout from "./layouts/Admin";
import PrincipalLayout from "./layouts/Principal";
import HodLayout from "./layouts/Hod";
import TutorLayout from "./layouts/Tutor";
import StudentLayout from "./layouts/Student";

// Admin Pages
import AdminDashboard from "./pages/admin/Admindashboard";
import AdminDepartment from "./pages/admin/AdminDepartment";
import AdminTeacher from "./pages/admin/AdminTeacher";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminForms from "./pages/admin/AdminForms";
import AdminSubmissions from "./pages/admin/AdminSubmissions";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentForms from "./pages/student/StudentForms";
import StudentFormView from "./pages/student/StudentFormView";
import StudentSubmissions from "./pages/student/StudentSubmissions";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSettings from "./pages/student/StudentSettings";

// Tutor Pages
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorStudents from "./pages/tutor/TutorStudents";
import TutorSubmissions from "./pages/tutor/TutorSubmissions";
import TutorForms from "./pages/tutor/TutorForms";
import TutorProfile from "./pages/tutor/TutorProfile";

// HOD Pages
import HoDDashboard from "./pages/hod/HoDDashboard";
import HodTutors from "./pages/hod/HodTutors";
import HodForms from "./pages/hod/HodForms";
import HodSubmissions from "./pages/hod/HodSubmissions";
import HodProfile from "./pages/hod/HodProfile";

// Principal Pages
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import PrincipalTeachers from "./pages/principal/PrincipalTeachers";
import PrincipalStudents from "./pages/principal/PrincipalStudents";
import PrincipalDepartments from "./pages/principal/PrincipalDepartments";
import PrincipalForms from "./pages/principal/PrincipalForms";
import PrincipalSubmissions from "./pages/principal/PrincipalSubmissions";
import PrincipalSettings from "./pages/principal/PrincipalSettings";


// Placeholder Dashboard for now
function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-50">
      <h2 className="text-2xl font-bold">Dashboard (Coming Soon)</h2>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="departments" element={<AdminDepartment />} />
          <Route path="teachers" element={<AdminTeacher />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="forms" element={<AdminForms />} />
          <Route path="submissions" element={<AdminSubmissions />} />
        </Route>

        <Route path="/student" element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="forms" element={<StudentForms />} />
          <Route path="forms/:id" element={<StudentFormView />} />
          <Route path="submissions" element={<StudentSubmissions />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        <Route path="/tutor" element={<ProtectedRoute><TutorLayout /></ProtectedRoute>}>
          <Route index element={<TutorDashboard />} />
          <Route path="students" element={<TutorStudents />} />
          <Route path="submissions" element={<TutorSubmissions />} />
          <Route path="forms" element={<TutorForms />} />
          <Route path="profile" element={<TutorProfile />} />
        </Route>

        <Route path="/hod" element={<ProtectedRoute><HodLayout /></ProtectedRoute>}>
          <Route index element={<HoDDashboard />} />
          <Route path="tutors" element={<HodTutors />} />
          <Route path="forms" element={<HodForms />} />
          <Route path="submissions" element={<HodSubmissions />} />
          <Route path="profile" element={<HodProfile />} />
        </Route>

        <Route path="/principal" element={<ProtectedRoute><PrincipalLayout /></ProtectedRoute>}>
          <Route index element={<PrincipalDashboard />} />
          <Route path="teachers" element={<PrincipalTeachers />} />
          <Route path="students" element={<PrincipalStudents />} />
          <Route path="departments" element={<PrincipalDepartments />} />
          <Route path="forms" element={<PrincipalForms />} />
          <Route path="submissions" element={<PrincipalSubmissions />} />
          <Route path="settings" element={<PrincipalSettings />} />
        </Route>
        
      </Routes>
    </Router>
  );
}


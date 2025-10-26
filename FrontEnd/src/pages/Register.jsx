import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Building2, Crown, GraduationCap, Users, ChevronDown } from 'lucide-react';
import { useStudent } from '../hooks/student';
import { useDepartment } from '../hooks/department';
import Toast from '../components/static/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
    college_id: '',
    department: '',
    course: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const { registerStudent, loading, toast, closeToast } = useStudent();
  const { listDepartments, listCourses } = useDepartment();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.department) {
      fetchCourses(formData.department);
    } else {
      setCourses([]);
    }
  }, [formData.department]);

  const fetchDepartments = async () => {
    try {
      const response = await listDepartments();
      setDepartments(response.departments || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchCourses = async (departmentId) => {
    try {
      const response = await listCourses(departmentId);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await registerStudent(formData);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setFormData(prev => ({ ...prev, [name]: value, course: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const benefits = [
    {
      icon: '🚀',
      title: "Quick Request Processing",
      description: "Submit requests and get faster responses from authorities"
    },
    {
      icon: '📊',
      title: "Real-time Tracking",
      description: "Monitor your request status with live updates"
    },
    {
      icon: '🔒',
      title: "Secure Platform",
      description: "End-to-end encrypted communication for your data safety"
    },
    {
      icon: '📱',
      title: "Easy Access",
      description: "Access from any device with internet connection"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="w-80 h-80 bg-cyan-500 rounded-full blur-3xl absolute top-1/4 left-1/4 animate-pulse"></div>
          <div className="w-80 h-80 bg-blue-500 rounded-full blur-3xl absolute bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="relative w-full max-w-7xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Registration Form */}
        <div className="lg:w-1/2 bg-white p-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Building2 className="w-10 h-10 text-blue-600" />
                <h1 className="text-4xl font-bold text-gray-900">SRMS</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 text-lg">
                Join the Student Request Management System
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="name@icet.ac.in"
                    className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone_number"
                    placeholder="Enter phone number"
                    className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    College ID
                  </label>
                  <input 
                    type="text" 
                    name="college_id"
                    placeholder="Enter college ID"
                    className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    value={formData.college_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea 
                  name="address"
                  placeholder="Enter your address"
                  rows={3}
                  className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Create a strong password"
                    className="w-full px-4 py-4 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4" />
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-200 hover:border-gray-300"
                    required
                    disabled={!formData.department}
                  >
                    <option value="">{formData.department ? 'Select Course' : 'Select Department First'}</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Register as Student'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-all"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600/90 to-cyan-600/90 p-12 text-white">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12">
              <h3 className="text-4xl font-bold mb-4">Why Join SRMS?</h3>
              <p className="text-xl text-blue-100/90 leading-relaxed">
                Experience the future of institutional communication and request management with our unified platform.
              </p>
            </div>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-6 group p-4 rounded-2xl hover:bg-white/10 transition-all duration-300">
                  <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-cyan-200 transition-colors">
                      {benefit.title}
                    </h4>
                    <p className="text-blue-100/80 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <h4 className="text-2xl font-semibold mb-4">🏆 Key Features</h4>
              <ul className="space-y-3 text-blue-100/90">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Digital request submission and tracking
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Role-based access control
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Real-time notifications
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Secure data management
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  Comprehensive audit logs
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Register;
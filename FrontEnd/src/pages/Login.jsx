import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, BookOpen, Building2, GraduationCap, Users } from 'lucide-react';
import { useAuth } from '../hooks/auth';
import Toast from '../components/static/Toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, toast, closeToast } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await login(formData);
      const { user_role } = response;
      
      // Navigate based on user type
      const dashboardPaths = {
        student: '/student',
        tutor: '/tutor',
        hod: '/hod',
        principal: '/principal',
        admin: '/admin'
      };
      
      navigate(dashboardPaths[user_role] || '/');
      
    } catch (error) {
      // Error handling is done in the auth hook with toast
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Request Management",
      description: "Submit and track various student requests efficiently"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Role-based Access",
      description: "Different dashboards for students, faculty, and administration"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Streamlined Communication",
      description: "Better coordination between students and authorities"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="w-72 h-72 bg-blue-500 rounded-full blur-3xl absolute top-10 left-10 animate-pulse"></div>
          <div className="w-72 h-72 bg-purple-500 rounded-full blur-3xl absolute bottom-10 right-10 animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side - Features */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600/90 to-purple-700/90 p-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-10 h-10" />
              <h1 className="text-4xl font-bold">SRMS</h1>
            </div>
            <p className="text-xl text-blue-100 font-light">
              Student Request Management System
            </p>
          </div>

          <div className="space-y-8 mt-16">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
            <p className="text-lg font-semibold mb-2">🎯 Project Vision</p>
            <p className="text-blue-100/90 text-sm leading-relaxed">
              Transforming institutional communication through digital innovation. 
              Streamlining request handling for better efficiency and transparency.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 bg-white p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-lg">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="your.name@icet.ac.in"
                    className="w-full px-4 py-4 pl-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg border-gray-200 hover:border-gray-300"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-4 pl-12 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg border-gray-200 hover:border-gray-300"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an student account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-all"
                >
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                Secure access to Student Request Management System
              </p>
              <p className="text-center text-gray-400 text-xs mt-2">
                © 2024 ICET Institution. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Login;
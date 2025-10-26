import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, FileText, Eye, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { usePrincipal } from '../../hooks/principal';

const PrincipalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getDashboardStats } = usePrincipal();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    totalHODs: 0,
    totalTutors: 0,
    pendingStudents: 0,
    approvedStudents: 0,
    totalForms: 0,
    pendingSubmissions: 0
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const statCards = [
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'HODs',
      value: stats.totalHODs,
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Tutors',
      value: stats.totalTutors,
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Pending Students',
      value: stats.pendingStudents,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Approved Students',
      value: stats.approvedStudents,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700'
    },
    {
      title: 'Total Forms',
      value: stats.totalForms,
      icon: <FileText className="w-8 h-8" />,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      textColor: 'text-pink-700'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingSubmissions,
      icon: <Eye className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Principal'}! 👑
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your institutional overview for today.
          </p>
        </div>
        
        {/* Clock */}
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-4 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{currentTime}</div>
            <div className="text-sm opacity-90">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgColor} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white shadow-lg`}>
                {card.icon}
              </div>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-r ${card.color} opacity-10 rounded-full`}></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Management Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Management</h2>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/principal/teachers')}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Manage Teachers</p>
                  <p className="text-sm text-gray-500">View and manage teaching staff</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/principal/students')}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Manage Students</p>
                  <p className="text-sm text-gray-500">Approve and manage students</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/principal/departments')}
              className="w-full p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Departments & Courses</p>
                  <p className="text-sm text-gray-500">Manage academic structure</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Form & Submission Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Forms & Reviews</h2>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/principal/forms')}
              className="w-full p-4 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-pink-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Manage Forms</p>
                  <p className="text-sm text-gray-500">Create and manage forms</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/principal/submissions')}
              className="w-full p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Review Submissions</p>
                  <p className="text-sm text-gray-500">Review pending submissions</p>
                </div>
              </div>
            </button>
            
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Recent Activity</p>
                  <p className="text-sm text-gray-500">No recent submissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalDashboard;
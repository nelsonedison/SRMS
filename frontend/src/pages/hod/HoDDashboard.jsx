import React, { useState, useEffect } from 'react';
import { Users, FileText, Eye, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { useHod } from '../../hooks/hod';
import { useNavigate } from 'react-router-dom';

const HoDDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getDashboardStats, getPendingSubmissions } = useHod();
  const [stats, setStats] = useState({
    departmentTutors: 0,
    activeForms: 0,
    pendingReviews: 0,
    totalSubmissions: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [statsData, submissionsData] = await Promise.all([
        getDashboardStats(user?.department_id),
        getPendingSubmissions()
      ]);
      
      setStats(statsData);
      setRecentSubmissions((submissionsData.submissions || []).slice(0, 5));
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
      title: 'Department Tutors',
      value: stats.departmentTutors,
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Active Forms',
      value: stats.activeForms,
      icon: <FileText className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: <Eye className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'HOD'}! 🎓
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your department overview for today.
          </p>
        </div>
        
        {/* Clock */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-4 rounded-2xl shadow-lg">
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
            <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Management</h2>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/hod/tutors')}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Manage Tutors</p>
                  <p className="text-sm text-gray-500">View and manage department tutors</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/hod/forms')}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Manage Forms</p>
                  <p className="text-sm text-gray-500">Create and manage department forms</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Review Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/hod/submissions')}
              className="w-full p-4 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform" />
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
                  <p className="text-sm text-gray-500">{recentSubmissions.length} pending reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Submissions */}
      {recentSubmissions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Submissions for Review</h2>
          <div className="space-y-3">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{submission.form_title}</h3>
                  <p className="text-sm text-gray-600">Student: {submission.student_name}</p>
                  <p className="text-sm text-gray-500">Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => navigate('/hod/submissions')}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HoDDashboard;

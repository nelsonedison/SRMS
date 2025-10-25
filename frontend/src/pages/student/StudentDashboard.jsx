import React, { useState, useEffect } from 'react';
import { FileText, Eye, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useStudentSubmissions, useStudentForms } from '../../hooks/student';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submissions, fetchSubmissions, getStats } = useStudentSubmissions();
  const { forms, fetchForms } = useStudentForms();
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    availableForms: 0
  });

  useEffect(() => {
    fetchSubmissions();
    fetchForms();
  }, []);

  useEffect(() => {
    const submissionStats = getStats();
    setStats({
      ...submissionStats,
      availableForms: forms.length
    });
  }, [submissions, forms]);

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
      title: 'Available Forms',
      value: stats.availableForms,
      icon: <FileText className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: <Eye className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Pending Review',
      value: stats.pendingSubmissions,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'Approved',
      value: stats.approvedSubmissions,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your submissions today.
          </p>
        </div>
        
        {/* Clock */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-lg">
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
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="space-y-4">
            {submissions.slice(0, 3).map((submission) => {
              const getStatusColor = (status) => {
                if (status === 'approved') return 'bg-green-500';
                if (status === 'rejected') return 'bg-red-500';
                if (status.includes('pending')) return 'bg-yellow-500';
                return 'bg-blue-500';
              };
              
              const getTimeAgo = (date) => {
                const now = new Date();
                const submittedDate = new Date(date);
                const diffInHours = Math.floor((now - submittedDate) / (1000 * 60 * 60));
                
                if (diffInHours < 1) return 'Just now';
                if (diffInHours < 24) return `${diffInHours} hours ago`;
                const diffInDays = Math.floor(diffInHours / 24);
                return `${diffInDays} days ago`;
              };
              
              return (
                <div key={submission.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(submission.status)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{submission.form_title}</p>
                    <p className="text-xs text-gray-500">{getTimeAgo(submission.submitted_at)}</p>
                  </div>
                </div>
              );
            })}
            
            {submissions.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/student/forms')}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Browse Available Forms</p>
                  <p className="text-sm text-gray-500">View and submit new requests</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/student/submissions')}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">View My Submissions</p>
                  <p className="text-sm text-gray-500">Track your request status</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/student/profile')}
              className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg text-left transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="font-medium text-gray-900">Update Profile</p>
                  <p className="text-sm text-gray-500">Manage your information</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
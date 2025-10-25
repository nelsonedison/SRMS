import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, FileText, Clock, GraduationCap } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { useForm } from '../../hooks/form';
import { useStudent } from '../../hooks/student';
import Toast from '../../components/static/Toast';

const TutorDashboard = () => {
  const { user } = useAuth();
  const { listSubmissions, listForms, loading: formLoading } = useForm();
  const { fetchApprovedStudents, loading: studentLoading } = useStudent();
  const [stats, setStats] = useState({
    courseStudents: 0,
    pendingReviews: 0,
    availableForms: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const dashboardStats = {
      courseStudents: 0,
      pendingReviews: 0,
      availableForms: 0
    };
    
    // Fetch student count
    try {
      const studentsData = await fetchApprovedStudents();
      dashboardStats.courseStudents = (studentsData.students || []).length;
    } catch (studentError) {
      console.error('Failed to fetch students:', studentError);
    }
    
    // Fetch forms count
    try {
      const formsData = await listForms();
      dashboardStats.availableForms = (formsData.forms || []).length;
    } catch (formsError) {
      console.error('Failed to fetch forms:', formsError);
    }
    
    // Fetch submissions
    try {
      const submissionsData = await listSubmissions();
      const pendingTutorSubmissions = (submissionsData.submissions || []).filter(
        submission => submission.status === 'pending_tutor'
      );
      setRecentSubmissions(pendingTutorSubmissions.slice(0, 5));
      dashboardStats.pendingReviews = pendingTutorSubmissions.length;
    } catch (submissionError) {
      console.error('Failed to fetch submissions:', submissionError);
      setRecentSubmissions([]);
    }
    
    setStats(dashboardStats);
    setLoading(false);
  };

  const closeToast = () => setToast(null);

  if (loading || formLoading || studentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Course Students</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.courseStudents}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingReviews}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Available Forms</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.availableForms}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>


      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Submissions for Review</h2>
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {recentSubmissions.length} Pending
          </span>
        </div>

        {recentSubmissions.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No pending submissions</h3>
            <p className="text-gray-500">All submissions have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{submission.form_title}</h3>
                    <p className="text-gray-600 text-sm">
                      Student: {submission.student_name} ({submission.student_college_id})
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    Pending Review
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/tutor/submissions'}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="font-medium">Review Submissions</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/tutor/students'}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">View Students</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/tutor/forms'}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Available Forms</span>
          </button>
        </div>
      </div>

      {/* Role Information */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-700 mb-2">Tutor Role Summary</h3>
        <p className="text-gray-700 leading-relaxed">
          As a tutor, you are responsible for reviewing and approving student form submissions from your course. 
          Once you approve a submission, it will be forwarded to the Head of Department (HOD) for further review. 
          You can manage students in your course and access all available forms.
        </p>
      </div>

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default TutorDashboard;
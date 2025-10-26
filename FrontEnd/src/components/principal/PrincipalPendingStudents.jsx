import { useState, useEffect } from 'react';
import { Check, X, RefreshCw, GraduationCap, Calendar, User } from 'lucide-react';
import { useStudent } from '../../hooks/student';

const PendingStudents = () => {
  const [students, setStudents] = useState([]);
  const [showAcademicYearModal, setShowAcademicYearModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [academicYearData, setAcademicYearData] = useState({
    academic_year_start: '',
    academic_year_end: ''
  });
  const { fetchPendingStudents: fetchPending, approveStudent, loading } = useStudent();

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await fetchPending();
      setStudents(response.students || []);
    } catch (error) {
      console.error('Failed to fetch pending students:', error);
    }
  };

  const handleApprove = (studentId) => {
    setSelectedStudentId(studentId);
    setShowAcademicYearModal(true);
  };

  const handleAcademicYearSubmit = async () => {
    try {
      await approveStudent(selectedStudentId, {
        action: 'approve',
        academic_year_start: academicYearData.academic_year_start,
        academic_year_end: academicYearData.academic_year_end
      });
      setShowAcademicYearModal(false);
      setSelectedStudentId(null);
      setAcademicYearData({ academic_year_start: '', academic_year_end: '' });
      fetchPendingStudents();
    } catch (error) {
      console.error('Failed to approve student:', error);
    }
  };

  const handleModalClose = () => {
    setShowAcademicYearModal(false);
    setSelectedStudentId(null);
    setAcademicYearData({ academic_year_start: '', academic_year_end: '' });
  };

  const handleReject = async (studentId) => {
    if (window.confirm('Are you sure you want to reject this student?')) {
      try {
        await approveStudent(studentId, { action: 'reject' });
        fetchPendingStudents();
      } catch (error) {
        console.error('Failed to reject student:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending students</h3>
        <p className="text-gray-500 mb-4">All student registrations have been processed</p>
        <button 
          onClick={fetchPendingStudents} 
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                  Pending
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{student.name}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{student.college_id}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {student.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span> {student.department_name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Course:</span> {student.course_name || 'N/A'}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Applied {new Date(student.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(student.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(student.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-medium"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Academic Year Modal */}
      {showAcademicYearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Set Academic Year</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year Start *
                </label>
                <input
                  type="date"
                  value={academicYearData.academic_year_start}
                  onChange={(e) => setAcademicYearData(prev => ({ ...prev, academic_year_start: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year End *
                </label>
                <input
                  type="date"
                  value={academicYearData.academic_year_end}
                  onChange={(e) => setAcademicYearData(prev => ({ ...prev, academic_year_end: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAcademicYearSubmit}
                disabled={loading || !academicYearData.academic_year_start || !academicYearData.academic_year_end}
                className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Approving...' : 'Approve Student'}
              </button>
              <button
                onClick={handleModalClose}
                className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingStudents;
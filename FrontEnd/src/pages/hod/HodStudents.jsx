import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, GraduationCap, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { useStudent } from '../../hooks/student';
import Toast from '../../components/static/Toast';

const HodStudents = () => {
  const { user } = useAuth();
  const { fetchPendingStudents, fetchApprovedStudents, approveStudent, loading, toast, closeToast } = useStudent();
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAcademicYearModal, setShowAcademicYearModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [academicYearData, setAcademicYearData] = useState({
    academic_year_start: '',
    academic_year_end: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch pending students
      const pendingData = await fetchPendingStudents();
      setPendingStudents(pendingData.students || []);
      
      // Fetch approved students
      const approvedData = await fetchApprovedStudents();
      setApprovedStudents(approvedData.students || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
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
      fetchStudents();
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
    if (confirm('Are you sure you want to reject this student?')) {
      try {
        await approveStudent(studentId, { action: 'reject' });
        fetchStudents();
      } catch (error) {
        console.error('Failed to reject student:', error);
      }
    }
  };

  const currentStudents = activeTab === 'pending' ? pendingStudents : approvedStudents;
  const filteredStudents = currentStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.college_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Students</h1>
          <p className="text-gray-600 mt-1">Manage students in your department</p>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredStudents.length} {activeTab === 'pending' ? 'Pending' : 'Approved'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pendingStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'approved'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Approved ({approvedStudents.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activeTab === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {activeTab === 'pending' ? 'Pending Approval' : 'Approved'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{student.name}</h3>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">College ID:</span> {student.college_id}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{student.email}</span>
                </div>
                {student.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{student.course_name}</span>
                </div>
              </div>
              
              {/* Approval Actions */}
              {activeTab === 'pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(student.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm flex-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(student.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm flex-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <span className="text-sm text-gray-500">Student approved</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No {activeTab} students
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'No students match your search' 
              : activeTab === 'pending'
              ? 'All students in your department have been processed'
              : 'No approved students in your department yet'
            }
          </p>
        </div>
      )}

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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAcademicYearSubmit}
                disabled={loading || !academicYearData.academic_year_start || !academicYearData.academic_year_end}
                className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default HodStudents;
import { useState, useEffect } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';
import { useStudent } from '../../hooks/student';
import Button from '../common/Button';
import Modal from '../common/Modal';

const PendingStudents = () => {
  const [students, setStudents] = useState([]);
  const [showAcademicYearModal, setShowAcademicYearModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [academicYearData, setAcademicYearData] = useState({
    academic_year_start: '',
    academic_year_end: ''
  });
  const { getPendingStudents, approveOrRejectStudent, loading } = useStudent();

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const response = await getPendingStudents();
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
      await approveOrRejectStudent(selectedStudentId, {
        action: 'approve',
        ...academicYearData
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
        await approveOrRejectStudent(studentId, { action: 'reject' });
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
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No pending students found</p>
        <button 
          onClick={fetchPendingStudents} 
          disabled={loading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">College ID</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Course</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
              <td className="py-3 px-4 text-gray-600">{student.email}</td>
              <td className="py-3 px-4 text-gray-600">{student.college_id}</td>
              <td className="py-3 px-4 text-gray-600">{student.department_name || '-'}</td>
              <td className="py-3 px-4 text-gray-600">{student.course_name || '-'}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(student.id)}
                    variant="success"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Check size={14} />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(student.id)}
                    variant="danger"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <X size={14} />
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal 
        isOpen={showAcademicYearModal} 
        onClose={handleModalClose} 
        title="Set Academic Year"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year Start *
            </label>
            <input
              type="date"
              value={academicYearData.academic_year_start}
              onChange={(e) => setAcademicYearData(prev => ({ ...prev, academic_year_start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year End *
            </label>
            <input
              type="date"
              value={academicYearData.academic_year_end}
              onChange={(e) => setAcademicYearData(prev => ({ ...prev, academic_year_end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAcademicYearSubmit}
              loading={loading}
              disabled={!academicYearData.academic_year_start || !academicYearData.academic_year_end}
              className="flex-1"
            >
              Approve Student
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PendingStudents;
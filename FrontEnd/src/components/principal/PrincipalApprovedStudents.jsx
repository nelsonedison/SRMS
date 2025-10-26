import { useState, useEffect } from 'react';
import { RefreshCw, Calendar, GraduationCap, User, CheckCircle } from 'lucide-react';
import { useStudent } from '../../hooks/student';

const ApprovedStudents = () => {
  const [students, setStudents] = useState([]);
  const { fetchApprovedStudents: fetchApproved, loading } = useStudent();

  useEffect(() => {
    fetchApprovedStudents();
  }, []);

  const fetchApprovedStudents = async () => {
    try {
      const response = await fetchApproved();
      setStudents(response.students || []);
    } catch (error) {
      console.error('Failed to fetch approved students:', error);
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
        <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No approved students</h3>
        <p className="text-gray-500 mb-4">No students have been approved yet</p>
        <button 
          onClick={fetchApprovedStudents} 
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
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Approved
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
                  <span>Approved {student.approved_at ? new Date(student.approved_at).toLocaleDateString() : 'N/A'}</span>
                </div>
                {student.academic_year_start && student.academic_year_end && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Academic Year:</span> {new Date(student.academic_year_start).getFullYear()} - {new Date(student.academic_year_end).getFullYear()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedStudents;
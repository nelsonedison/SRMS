import { useState, useEffect } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import { useStudent } from '../../hooks/student';
import Button from '../common/Button';

const ApprovedStudents = () => {
  const [students, setStudents] = useState([]);
  const { getApprovedStudents, loading } = useStudent();

  useEffect(() => {
    fetchApprovedStudents();
  }, []);

  const fetchApprovedStudents = async () => {
    try {
      const response = await getApprovedStudents();
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
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No approved students found</p>
        <button 
          onClick={fetchApprovedStudents} 
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
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900">Approved Date</th>
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </td>
              <td className="py-3 px-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {student.approved_at ? new Date(student.approved_at).toLocaleDateString() : '-'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedStudents;
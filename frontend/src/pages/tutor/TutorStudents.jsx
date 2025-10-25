import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, GraduationCap, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/auth';
import { useStudent } from '../../hooks/student';
import Toast from '../../components/static/Toast';

const TutorStudents = () => {
  const { user } = useAuth();
  const { fetchApprovedStudents, loading, toast, closeToast } = useStudent();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await fetchApprovedStudents();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.college_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );



  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Course Students</h1>
          <p className="text-gray-600 mt-1">Manage students in your course</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredStudents.length} Students</span>
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
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  student.approval_status === 'approved' 
                    ? 'bg-green-100 text-green-700' 
                    : student.approval_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {student.approval_status}
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
              
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    student.academic_year_active ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className={`text-sm font-medium ${
                    student.academic_year_active ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {student.academic_year_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No students found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'No students in your course yet'}
          </p>
        </div>
      )}

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default TutorStudents;
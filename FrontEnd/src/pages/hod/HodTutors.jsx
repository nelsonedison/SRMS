import React, { useState, useEffect } from 'react';
import { Users, Search, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { useTeacher } from '../../hooks/teacher';
import { useAuth } from '../../hooks/auth';
import Toast from '../../components/static/Toast';

const HodTutors = () => {
  const { listTeachers, deleteTeacher, loading, toast, closeToast } = useTeacher();
  const { user } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const data = await listTeachers();
      console.log('API Response:', data);
      console.log('User department_id:', user?.department_id);
      
      // Filter tutors from the same department
      const departmentTutors = (data.teachers || []).filter(
        teacher => {
          console.log('Teacher:', teacher.name, 'Role:', teacher.role, 'Dept ID:', teacher.department_id);
          return teacher.role === 'tutor' && teacher.department_id === user?.department_id;
        }
      );
      
      console.log('Filtered tutors:', departmentTutors);
      
      // Fallback: if no tutors found with department filter, show all tutors with role 'tutor'
      if (departmentTutors.length === 0) {
        const allTutors = (data.teachers || []).filter(teacher => teacher.role === 'tutor');
        console.log('Using fallback - all tutors:', allTutors);
        setTutors(allTutors);
      } else {
        setTutors(departmentTutors);
      }
    } catch (error) {
      console.error('Failed to fetch tutors:', error);
    }
  };

  const handleDeactivate = async (tutorId) => {
    if (confirm('Are you sure you want to deactivate this tutor?')) {
      try {
        await deleteTeacher(tutorId);
        fetchTutors();
      } catch (error) {
        console.error('Failed to deactivate tutor:', error);
      }
    }
  };

  const filteredTutors = tutors.filter(tutor =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Department Tutors</h1>
          <p className="text-gray-600 mt-1">Manage tutors in your department</p>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredTutors.length} Tutors</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tutors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tutor.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {tutor.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tutor.name}</h3>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID:</span> {tutor.employee_id}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{tutor.email}</span>
                </div>
                {tutor.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{tutor.phone_number}</span>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Course:</span> {tutor.course_name || 'N/A'}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tutor.is_active ? (
                    <UserCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <UserX className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    tutor.is_active ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {tutor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {/* <button
                  onClick={() => handleDeactivate(tutor.id)}
                  className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm"
                  disabled={!tutor.is_active}
                >
                  Deactivate
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTutors.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutors found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'No tutors in your department yet'}
          </p>
        </div>
      )}

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default HodTutors;
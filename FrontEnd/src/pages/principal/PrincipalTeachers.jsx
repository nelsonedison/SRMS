import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Edit3, Trash2, UserCheck, UserX, Plus } from 'lucide-react';
import { useTeacher } from '../../hooks/teacher';
import { useDepartment } from '../../hooks/department';
import PrincipalCreateTeacher from '../../components/principal/PrincipalCreateTeacher';
import PrincipalEditTeacher from '../../components/principal/PrincipalEditTeacher';

const PrincipalTeachers = () => {
  const { listTeachers, deleteTeacher, loading } = useTeacher();
  const { departments, fetchDepartments } = useDepartment();
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await listTeachers();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchTeachers();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchTeachers();
  };

  const handleDeactivate = async (teacherId) => {
    if (confirm('Are you sure you want to deactivate this teacher?')) {
      try {
        await deleteTeacher(teacherId);
        fetchTeachers();
      } catch (error) {
        console.error('Failed to deactivate teacher:', error);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'hod': return 'bg-blue-100 text-blue-700';
      case 'tutor': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || teacher.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600 mt-1">Manage teaching staff and their roles</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredTeachers.length} Teachers</span>
        </div>
      </div>

      {/* Search, Filter and Create */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
            >
              <option value="">All Roles</option>
              <option value="hod">HOD</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Teacher
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(teacher.role)}`}>
                  {teacher.role.toUpperCase()}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{teacher.name}</h3>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">ID:</span> {teacher.employee_id}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {teacher.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {teacher.phone_number}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Department:</span> {teacher.department_name || 'N/A'}
                </p>
                {teacher.course_name && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Course:</span> {teacher.course_name}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {teacher.is_active ? (
                    <UserCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <UserX className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${teacher.is_active ? 'text-green-700' : 'text-red-700'}`}>
                    {teacher.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(teacher)}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                    title="Edit Teacher"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivate(teacher.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Deactivate Teacher"
                    disabled={!teacher.is_active}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No teachers found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Create Teacher Modal */}
      <PrincipalCreateTeacher
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        departments={departments}
      />

      {/* Edit Teacher Modal */}
      <PrincipalEditTeacher
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        teacher={selectedTeacher}
        departments={departments}
      />
    </div>
  );
};

export default PrincipalTeachers;
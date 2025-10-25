import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTeacher } from '../../hooks/teacher';
import { useDepartment } from '../../hooks/department';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from '../../components/static/Toast';
import AdminCreateTeacher from '../../components/admin/AdminCreateTeacher';
import AdminEditTeacher from '../../components/admin/AdminEditTeacher';

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { listTeachers, deleteTeacher, loading, toast, closeToast } = useTeacher();
  const { listDepartments } = useDepartment();

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await listTeachers();
      setTeachers(response.teachers || []);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await listDepartments();
      setDepartments(response.departments || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchTeachers();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedTeacher(null);
    fetchTeachers();
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteTeacher(id);
        fetchTeachers();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600">Manage teachers and their information</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Teacher
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{teacher.name}</td>
                    <td className="py-3 px-4 text-gray-600">{teacher.email}</td>
                    <td className="py-3 px-4 text-gray-600 capitalize">{teacher.role}</td>
                    <td className="py-3 px-4 text-gray-600">{teacher.department_name || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(teacher)}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Edit size={14} />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(teacher.id)}
                          variant="danger"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <AdminCreateTeacher
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        departments={departments}
      />

      <AdminEditTeacher
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        teacher={selectedTeacher}
        departments={departments}
      />

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Teacher;
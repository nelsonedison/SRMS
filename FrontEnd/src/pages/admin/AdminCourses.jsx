import { useState, useEffect } from 'react';
import { Plus, Edit, Filter } from 'lucide-react';
import { useDepartment } from '../../hooks/department';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from '../../components/static/Toast';
import AdminCreateCourseModal from '../../components/admin/AdminCreateCourseModal';
import AdminEditCourseModal from '../../components/admin/AdminEditCourseModal';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { listCourses, listDepartments, loading, toast, closeToast } = useDepartment();

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [selectedDepartment]);

  const fetchCourses = async () => {
    try {
      const response = await listCourses(selectedDepartment || null);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
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
    fetchCourses();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedCourse(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Manage courses and their information</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Course
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No courses found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{course.name}</td>
                    <td className="py-3 px-4 text-gray-600">{course.code}</td>
                    <td className="py-3 px-4 text-gray-600">{course.department_name || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{course.description || '-'}</td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => handleEdit(course)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <AdminCreateCourseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        departments={departments}
      />

      <AdminEditCourseModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        course={selectedCourse}
        departments={departments}
      />

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Courses;
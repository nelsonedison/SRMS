import { useState, useEffect } from 'react';
import { useDepartment } from '../../hooks/department';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Toast from '../static/Toast';

const EditCourseModal = ({ isOpen, onClose, onSuccess, course, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    description: ''
  });
  const { updateCourse, loading, toast, closeToast } = useDepartment();

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        code: course.code || '',
        department: course.department || '',
        description: course.description || ''
      });
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course?.id) return;
    
    try {
      await updateCourse(course.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to update course:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', department: '', description: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course code (e.g., BTECH)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course description"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Update Course
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
      {toast && <Toast {...toast} onClose={closeToast} />}
    </Modal>
  );
};

export default EditCourseModal;
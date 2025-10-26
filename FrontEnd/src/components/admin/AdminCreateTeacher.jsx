import { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/teacher';
import { useDepartment } from '../../hooks/department';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Toast from '../static/Toast';

const CreateTeacher = ({ isOpen, onClose, onSuccess, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    employee_id: '',
    role: 'tutor',
    department: '',
    course: '',
    password: ''
  });
  const [courses, setCourses] = useState([]);
  const { createTeacher, loading, toast, closeToast } = useTeacher();
  const { listCourses } = useDepartment();

  useEffect(() => {
    if (formData.department) {
      fetchCourses(formData.department);
    } else {
      setCourses([]);
    }
  }, [formData.department]);

  const fetchCourses = async (departmentId) => {
    try {
      const response = await listCourses(departmentId);
      setCourses(response.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeacher(formData);
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        employee_id: '',
        role: 'tutor',
        department: '',
        course: '',
        password: ''
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create teacher:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      // Clear department and course when role changes
      setFormData(prev => ({ ...prev, [name]: value, department: '', course: '' }));
    } else if (name === 'department') {
      // Clear course when department changes
      setFormData(prev => ({ ...prev, [name]: value, course: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone_number: '',
      employee_id: '',
      role: 'tutor',
      department: '',
      course: '',
      password: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Teacher" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter teacher name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID *
            </label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter employee ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="tutor">Tutor</option>
              <option value="hod">HOD</option>
              <option value="principal">Principal</option>
            </select>
          </div>

          {formData.role !== 'principal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department {formData.role !== 'principal' ? '*' : ''}
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={formData.role !== 'principal'}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.role === 'tutor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.department}
              >
                <option value="">{formData.department ? 'Select Course' : 'Select Department First'}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Create Teacher
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

export default CreateTeacher;
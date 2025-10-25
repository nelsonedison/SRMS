import { useState, useEffect } from 'react';
import { useDepartment } from '../../hooks/department';
import Modal from '../common/Modal';
import Button from '../common/Button';

const EditDepartmentModal = ({ isOpen, onClose, onSuccess, department }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  const { updateDepartment, loading } = useDepartment();

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        code: department.code || '',
        description: department.description || ''
      });
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!department?.id) return;
    
    try {
      await updateDepartment(department.id, formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to update department:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setFormData({ name: '', code: '', description: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Department">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter department name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter department code (e.g., CSE)"
            required
          />
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
            placeholder="Enter department description"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Update Department
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
    </Modal>
  );
};

export default EditDepartmentModal;
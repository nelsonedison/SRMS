import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useDepartment } from '../../hooks/department';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Toast from '../../components/static/Toast';
import AdminDepartmentList from '../../components/admin/AdminDepartmentList';
import AdminCreateDepartmentModal from '../../components/admin/AdminCreateDepartmentModal';
import AdminEditDepartmentModal from '../../components/admin/AdminEditDepartmentModal';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { listDepartments, loading, toast, closeToast } = useDepartment();

  useEffect(() => {
    fetchDepartments();
  }, []);

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
    fetchDepartments();
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedDepartment(null);
    fetchDepartments();
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Manage departments and their information</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add Department
        </Button>
      </div>

      <Card>
        <AdminDepartmentList
          departments={departments}
          loading={loading}
          onEdit={handleEdit}
          onRefresh={fetchDepartments}
        />
      </Card>

      <AdminCreateDepartmentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      <AdminEditDepartmentModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        department={selectedDepartment}
      />

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Department;
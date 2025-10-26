import React from 'react';
import { useForm } from '../../hooks/form';
import AdminFormsList from '../../components/admin/AdminFormsList';
import Toast from '../../components/static/Toast';

const Forms = () => {
  const { toast, closeToast } = useForm();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Management</h1>
        <p className="text-gray-600">Create and manage custom forms</p>
      </div>

      <AdminFormsList />

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Forms;
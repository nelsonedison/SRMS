import React from 'react';
import { useForm } from '../../hooks/form';
import AdminSubmissionsList from '../../components/admin/AdminSubmissionsList';
import Toast from '../../components/static/Toast';

const Submissions = () => {
  const { toast, closeToast } = useForm();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submission Management</h1>
        <p className="text-gray-600">Review and manage form submissions</p>
      </div>

      <AdminSubmissionsList />

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Submissions;
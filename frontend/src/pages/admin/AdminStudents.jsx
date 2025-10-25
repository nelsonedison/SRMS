import { useState } from 'react';
import { Users, UserCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import Toast from '../../components/static/Toast';
import AdminPendingStudents from '../../components/admin/AdminPendingStudents';
import AdminApprovedStudents from '../../components/admin/AdminApprovedStudents';
import { useStudent } from '../../hooks/student';

const Students = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { toast, closeToast } = useStudent();

  const tabs = [
    { id: 'pending', label: 'Pending Approvals', icon: <Users size={16} /> },
    { id: 'approved', label: 'Approved Students', icon: <UserCheck size={16} /> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <p className="text-gray-600">Manage student registrations and approvals</p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <Card>
        {activeTab === 'pending' && <AdminPendingStudents />}
        {activeTab === 'approved' && <AdminApprovedStudents />}
      </Card>

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default Students;
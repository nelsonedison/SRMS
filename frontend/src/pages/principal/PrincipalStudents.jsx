import React, { useState } from 'react';
import { Users, UserCheck, GraduationCap } from 'lucide-react';
import PrincipalPendingStudents from '../../components/principal/PrincipalPendingStudents';
import PrincipalApprovedStudents from '../../components/principal/PrincipalApprovedStudents';
import { useStudent } from '../../hooks/student';
import Toast from '../../components/static/Toast';

const PrincipalStudents = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const { toast, closeToast } = useStudent();

  const tabs = [
    { 
      id: 'pending', 
      label: 'Pending Approvals', 
      icon: <Users size={18} />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    },
    { 
      id: 'approved', 
      label: 'Approved Students', 
      icon: <UserCheck size={18} />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-1">Manage student registrations and approvals</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg">
        {activeTab === 'pending' && <PrincipalPendingStudents />}
        {activeTab === 'approved' && <PrincipalApprovedStudents />}
      </div>

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default PrincipalStudents;
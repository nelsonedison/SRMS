import React, { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, XCircle, FileText, Calendar, User } from 'lucide-react';
import { useStudentSubmissions } from '../../hooks/student';

const StudentSubmissions = () => {
  const { submissions, loading, fetchSubmissions } = useStudentSubmissions();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_tutor': return 'text-orange-600 bg-orange-100';
      case 'pending_hod': return 'text-blue-600 bg-blue-100';
      case 'pending_principal': return 'text-purple-600 bg-purple-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_tutor': return 'Pending Tutor Review';
      case 'pending_hod': return 'Pending HOD Review';
      case 'pending_principal': return 'Pending Principal Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_tutor':
      case 'pending_hod':
      case 'pending_principal':
        return <Clock className="w-5 h-5" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  const filteredSubmissions = (submissions || []).filter(submission => {
    if (filter === 'all') return true;
    if (filter === 'pending') return submission.status.includes('pending');
    return submission.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-600 mt-1">Track the status of your form submissions</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredSubmissions.length} Submissions</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Submissions', count: (submissions || []).length },
            { key: 'pending', label: 'Pending', count: (submissions || []).filter(s => s.status.includes('pending')).length },
            { key: 'approved', label: 'Approved', count: (submissions || []).filter(s => s.status === 'approved').length },
            { key: 'rejected', label: 'Rejected', count: (submissions || []).filter(s => s.status === 'rejected').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions?.map((submission) => (
          <div key={submission.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{submission.form_title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted {new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(submission.status)}`}>
                  {getStatusIcon(submission.status)}
                  <span className="font-medium">{getStatusText(submission.status)}</span>
                </div>
              </div>

              {/* Approval Timeline */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Approval Timeline</h4>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    submission.tutor_reviewed_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Tutor</span>
                    {submission.tutor_reviewed_at && <CheckCircle className="w-4 h-4" />}
                  </div>
                  
                  <div className={`w-8 h-0.5 ${submission.tutor_reviewed_at ? 'bg-green-300' : 'bg-gray-300'}`}></div>
                  
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    submission.hod_reviewed_at ? 'bg-green-100 text-green-700' : 
                    submission.tutor_reviewed_at ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">HOD</span>
                    {submission.hod_reviewed_at && <CheckCircle className="w-4 h-4" />}
                  </div>
                  
                  <div className={`w-8 h-0.5 ${submission.hod_reviewed_at ? 'bg-green-300' : 'bg-gray-300'}`}></div>
                  
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    submission.principal_reviewed_at ? 'bg-green-100 text-green-700' : 
                    submission.hod_reviewed_at ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Principal</span>
                    {submission.principal_reviewed_at && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Comments */}
              {(submission.tutor_comments || submission.hod_comments || submission.principal_comments) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Comments</h4>
                  
                  {submission.tutor_comments && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Tutor</span>
                      </div>
                      <p className="text-sm text-gray-600">{submission.tutor_comments}</p>
                    </div>
                  )}
                  
                  {submission.hod_comments && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">HOD</span>
                      </div>
                      <p className="text-sm text-gray-600">{submission.hod_comments}</p>
                    </div>
                  )}
                  
                  {submission.principal_comments && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Principal</span>
                      </div>
                      <p className="text-sm text-gray-600">{submission.principal_comments}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No submissions found</h3>
          <p className="text-gray-500">You haven't submitted any forms yet</p>
        </div>
      )}
    </div>
  );
};

export default StudentSubmissions;
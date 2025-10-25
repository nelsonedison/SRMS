import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, MessageSquare, User, Calendar } from 'lucide-react';
import { useForm } from '../../hooks/form';
import Toast from '../../components/static/Toast';

const PrincipalSubmissions = () => {
  const { 
    listSubmissions, 
    reviewSubmission, 
    loading, 
    toast, 
    closeToast 
  } = useForm();
  
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    action: '',
    comments: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await listSubmissions();
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setShowReviewModal(true);
    setReviewData({ action: '', comments: '' });
  };

  const handleSubmitReview = async () => {
    try {
      await reviewSubmission(selectedSubmission.id, reviewData);
      setShowReviewModal(false);
      setSelectedSubmission(null);
      setReviewData({ action: '', comments: '' });
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to review submission:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_tutor': return 'text-yellow-600 bg-yellow-100';
      case 'pending_hod': return 'text-blue-600 bg-blue-100';
      case 'pending_principal': return 'text-purple-600 bg-purple-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_tutor':
      case 'pending_hod':
      case 'pending_principal':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending_principal');
  const reviewedSubmissions = submissions.filter(s => s.status !== 'pending_principal');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submission Reviews</h1>
          <p className="text-gray-600 mt-1">Review and approve student form submissions</p>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
          <Eye className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingSubmissions.length}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
              <p className="text-sm text-gray-600">Total Submissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Reviews ({pendingSubmissions.length})
            </h2>
          </div>

          <div className="space-y-4">
            {pendingSubmissions.map((submission) => (
              <div key={submission.id} className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{submission.form_title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span className="ml-1">{formatStatus(submission.status)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{submission.student_name} ({submission.student_college_id})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(submission.submitted_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Approval Timeline */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center gap-2 ${submission.tutor_reviewed_at ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Tutor</span>
                      </div>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className={`flex items-center gap-2 ${submission.hod_reviewed_at ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">HOD</span>
                      </div>
                      <div className="w-8 h-px bg-gray-300"></div>
                      <div className="flex items-center gap-2 text-purple-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Principal</span>
                      </div>
                    </div>

                    {/* Comments */}
                    {(submission.tutor_comments || submission.hod_comments) && (
                      <div className="space-y-2 mb-4">
                        {submission.tutor_comments && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">Tutor Comment:</p>
                            <p className="text-sm text-gray-700">"{submission.tutor_comments}"</p>
                          </div>
                        )}
                        {submission.hod_comments && (
                          <div className="bg-white rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">HOD Comment:</p>
                            <p className="text-sm text-gray-700">"{submission.hod_comments}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submission Data Preview */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Submitted Data:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(submission.data || {}).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-medium text-gray-600">{key}:</span>
                            <span className="ml-2 text-gray-800">{String(value).substring(0, 50)}{String(value).length > 50 ? '...' : ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleReview(submission)}
                    className="ml-4 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Submissions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            All Submissions ({submissions.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Form</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Student</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Submitted</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{submission.form_title}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{submission.student_name}</p>
                      <p className="text-sm text-gray-500">{submission.student_college_id}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      {formatStatus(submission.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {submission.status === 'pending_principal' ? (
                      <button
                        onClick={() => handleReview(submission)}
                        className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                      >
                        Review
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Review Submission</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium text-gray-900">{selectedSubmission.form_title}</p>
                  <p className="text-sm text-gray-600">
                    Submitted by {selectedSubmission.student_name} ({selectedSubmission.student_college_id})
                  </p>
                </div>

                {/* Full Submission Data */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Submitted Data:</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedSubmission.data || {}).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="font-medium text-gray-600 w-1/3">{key}:</span>
                        <span className="text-gray-800 w-2/3">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Previous Comments */}
                {(selectedSubmission.tutor_comments || selectedSubmission.hod_comments) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Previous Reviews:</h4>
                    {selectedSubmission.tutor_comments && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-700 mb-1">Tutor:</p>
                        <p className="text-sm text-gray-700">"{selectedSubmission.tutor_comments}"</p>
                      </div>
                    )}
                    {selectedSubmission.hod_comments && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-700 mb-1">HOD:</p>
                        <p className="text-sm text-gray-700">"{selectedSubmission.hod_comments}"</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Review Action */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Your Decision:</h4>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="action"
                        value="approve"
                        checked={reviewData.action === 'approve'}
                        onChange={(e) => setReviewData({...reviewData, action: e.target.value})}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <span className="text-green-700 font-medium">Approve</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="action"
                        value="reject"
                        checked={reviewData.action === 'reject'}
                        onChange={(e) => setReviewData({...reviewData, action: e.target.value})}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="text-red-700 font-medium">Reject</span>
                    </label>
                  </div>
                  
                  <textarea
                    placeholder="Comments (optional)"
                    value={reviewData.comments}
                    onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSubmitReview}
                  disabled={!reviewData.action || loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default PrincipalSubmissions;
import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { useForm } from '../../hooks/form';
import Toast from '../../components/static/Toast';

const TutorSubmissions = () => {
  const { listSubmissions, reviewSubmission, loading, toast, closeToast } = useForm();
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
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
      // Show all submissions
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const handleReview = async (submissionId) => {
    if (!reviewData.action) {
      alert('Please select an action');
      return;
    }

    try {
      await reviewSubmission(submissionId, reviewData);
      setSelectedSubmission(null);
      setReviewData({ action: '', comments: '' });
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to review submission:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.form_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.student_college_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Submission Reviews</h1>
          <p className="text-gray-600 mt-1">Review and approve student form submissions</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg">
          <span className="font-semibold">{filteredSubmissions.filter(s => s.status === 'pending_tutor').length} Pending Review</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending submissions</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No submissions match your search' : 'All submissions have been reviewed'}
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {submission.form_title}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Student:</span> {submission.student_name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">College ID:</span> {submission.student_college_id}
                      </p>
                      <p className="text-gray-500 text-sm">
                        <span className="font-medium">Submitted:</span> {new Date(submission.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                      submission.status === 'pending_tutor' 
                        ? 'bg-orange-100 text-orange-700'
                        : submission.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : submission.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {submission.status === 'pending_tutor' && <Clock className="w-4 h-4" />}
                      {submission.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                      {submission.status === 'rejected' && <XCircle className="w-4 h-4" />}
                      {submission.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Form Data Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Form Data:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(submission.data || {}).slice(0, 4).map(([key, value]) => (
                      <p key={key} className="text-sm text-gray-600">
                        <span className="font-medium">{key}:</span> {value}
                      </p>
                    ))}
                  </div>
                  {Object.keys(submission.data || {}).length > 4 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{Object.keys(submission.data).length - 4} more fields...
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {submission.status === 'pending_tutor' ? (
                    <button
                      onClick={() => setSelectedSubmission(submission.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedSubmission(submission.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                      View Only
                    </button>
                  )}
                </div>

                {/* Review Modal */}
                {selectedSubmission === submission.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Review Submission: {submission.form_title}
                      </h3>

                      {/* Full Form Data */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Complete Form Data:</h4>
                        <div className="space-y-2">
                          {Object.entries(submission.data || {}).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-200 pb-2">
                              <p className="text-sm font-medium text-gray-700">{key}:</p>
                              <p className="text-sm text-gray-600">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Review Actions */}
                      {submission.status === 'pending_tutor' ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Review Decision:
                            </label>
                            <div className="flex gap-3">
                              <button
                                onClick={() => setReviewData({...reviewData, action: 'approve'})}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                  reviewData.action === 'approve'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => setReviewData({...reviewData, action: 'reject'})}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                  reviewData.action === 'reject'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Comments:
                            </label>
                            <textarea
                              value={reviewData.comments}
                              onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                              placeholder="Add your review comments..."
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-4">
                            <button
                              onClick={() => handleReview(submission.id)}
                              disabled={!reviewData.action}
                              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Submit Review
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSubmission(null);
                                setReviewData({ action: '', comments: '' });
                              }}
                              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-600 text-center">
                            This submission has already been reviewed and cannot be modified.
                          </p>
                          <div className="flex justify-center mt-4">
                            <button
                              onClick={() => {
                                setSelectedSubmission(null);
                                setReviewData({ action: '', comments: '' });
                              }}
                              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {toast && <Toast {...toast} onClose={closeToast} />}
    </div>
  );
};

export default TutorSubmissions;
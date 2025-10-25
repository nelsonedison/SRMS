import { useState, useEffect } from 'react';
import { Eye, Check, X } from 'lucide-react';
import { useForm } from '../../hooks/form';

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const { listSubmissions, reviewSubmission, loading } = useForm();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await listSubmissions();
      setSubmissions(response.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    }
  };

  const handleReviewSubmission = async (id, action, comments = '') => {
    try {
      await reviewSubmission(id, { action, comments });
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to review submission:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Form Submissions</h2>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{submission.form_title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Submitted by: {submission.student_name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span>Date: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </span>
                    </div>
                    {submission.comments && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Comments:</strong> {submission.comments}
                      </p>
                    )}
                  </div>
                  
                  {submission.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleReviewSubmission(submission.id, 'approve')}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewSubmission(submission.id, 'reject')}
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {submissions.length === 0 && (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600">Form submissions will appear here for review</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;
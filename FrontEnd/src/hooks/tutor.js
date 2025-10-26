import { useState } from 'react';
import { APIENDPOINTS } from '../api/endpoints';

export const useTutor = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const closeToast = () => setToast(null);

  // Get course students
  const getCourseStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api${APIENDPOINTS.APPROVED_STUDENT}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Failed to fetch students'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get tutor dashboard stats
  const getDashboardStats = async () => {
    setLoading(true);
    try {
      const [submissionsResponse, formsResponse] = await Promise.all([
        fetch(`/api${APIENDPOINTS.SUBMISSIONS_LIST}?status=pending_tutor`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`/api${APIENDPOINTS.FORMS_LIST}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      let submissionsData = { submissions: [] };
      let formsData = { forms: [] };

      if (submissionsResponse.ok) {
        submissionsData = await submissionsResponse.json();
      }
      
      if (formsResponse.ok) {
        formsData = await formsResponse.json();
      }

      return {
        pendingReviews: submissionsData.submissions?.length || 0,
        availableForms: formsData.forms?.length || 0,
        totalSubmissions: submissionsData.submissions?.length || 0,
        courseStudents: 0
      };
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to fetch dashboard data'
      });
      // Return default stats instead of throwing
      return {
        pendingReviews: 0,
        availableForms: 0,
        totalSubmissions: 0,
        courseStudents: 0
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    toast,
    closeToast,
    getCourseStudents,
    getDashboardStats
  };
};
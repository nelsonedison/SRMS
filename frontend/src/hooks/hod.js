import { useState } from 'react';
import { useTeacher } from './teacher';
import { useForm } from './form';

export const useHod = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Import hooks
  const teacherHook = useTeacher();
  const formHook = useForm();

  // Dashboard stats for HOD
  const getDashboardStats = async (departmentId) => {
    setLoading(true);
    try {
      const [teachersData, formsData, submissionsData] = await Promise.all([
        teacherHook.listTeachers(),
        formHook.listForms(departmentId),
        formHook.listSubmissions()
      ]);
      
      const teachersList = teachersData.teachers || [];
      const formsList = formsData.forms || [];
      const submissionsList = submissionsData.submissions || [];
      
      return {
        departmentTutors: teachersList.filter(t => t.role === 'tutor' && t.department_id === departmentId).length,
        activeForms: formsList.filter(f => f.is_active).length,
        pendingReviews: submissionsList.filter(s => s.status === 'pending_hod').length,
        totalSubmissions: submissionsList.length
      };
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to fetch dashboard statistics'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get department tutors
  const getDepartmentTutors = async (departmentId) => {
    setLoading(true);
    try {
      const data = await teacherHook.listTeachers();
      const departmentTutors = (data.teachers || []).filter(
        teacher => teacher.role === 'tutor' && teacher.department_id === departmentId
      );
      return { teachers: departmentTutors };
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to fetch department tutors'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get pending HOD submissions
  const getPendingSubmissions = async () => {
    setLoading(true);
    try {
      const data = await formHook.listSubmissions();
      const hodPendingSubmissions = (data.submissions || []).filter(
        submission => submission.status === 'pending_hod'
      );
      return { submissions: hodPendingSubmissions };
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to fetch pending submissions'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => setToast(null);

  return {
    // State
    loading,
    toast,
    closeToast,
    
    // HOD specific operations
    getDashboardStats,
    getDepartmentTutors,
    getPendingSubmissions,
    
    // Teacher operations
    ...teacherHook,
    
    // Form operations
    ...formHook
  };
};
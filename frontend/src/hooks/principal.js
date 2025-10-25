import { useState } from 'react';
import { useTeacher } from './teacher';
import { useStudent } from './student';
import { useDepartment } from './department';
import { useForm } from './form';

export const usePrincipal = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Import all hooks
  const teacherHook = useTeacher();
  const studentHook = useStudent();
  const departmentHook = useDepartment();
  const formHook = useForm();

  // Dashboard stats
  const getDashboardStats = async () => {
    setLoading(true);
    try {
      const [teachersData, formsData, submissionsData] = await Promise.all([
        teacherHook.listTeachers(),
        formHook.listForms(),
        formHook.listSubmissions()
      ]);
      
      const teachersList = teachersData.teachers || [];
      const formsList = formsData.forms || [];
      const submissionsList = submissionsData.submissions || [];
      
      // Fetch student data
      let pendingCount = 0;
      let approvedCount = 0;
      try {
        const [pendingData, approvedData] = await Promise.all([
          studentHook.fetchPendingStudents(),
          studentHook.fetchApprovedStudents()
        ]);
        
        pendingCount = pendingData.students?.length || 0;
        approvedCount = approvedData.students?.length || 0;
      } catch (studentError) {
        console.error('Failed to fetch student data:', studentError);
      }
      
      return {
        totalTeachers: teachersList.length,
        totalHODs: teachersList.filter(t => t.role === 'hod').length,
        totalTutors: teachersList.filter(t => t.role === 'tutor').length,
        pendingStudents: pendingCount,
        approvedStudents: approvedCount,
        totalForms: formsList.length,
        pendingSubmissions: submissionsList.filter(s => s.status === 'pending_principal').length
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

  const closeToast = () => setToast(null);

  return {
    // State
    loading,
    toast,
    closeToast,
    
    // Dashboard
    getDashboardStats,
    
    // Teacher operations
    ...teacherHook,
    
    // Student operations
    ...studentHook,
    
    // Department operations
    ...departmentHook,
    
    // Form operations
    ...formHook
  };
};
export const getWorkflowDisplay = (workflow) => {
  const workflows = {
    'tutor_only': 'Tutor Only',
    'hod_only': 'HOD Only', 
    'tutor_hod': 'Tutor → HOD',
    'tutor_hod_principal': 'Tutor → HOD → Principal'
  };
  return workflows[workflow] || workflow;
};

export const getStatusDisplay = (status) => {
  const statusMap = {
    'pending_tutor': 'Pending Tutor Review',
    'pending_hod': 'Pending HOD Review', 
    'pending_principal': 'Pending Principal Review',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  return statusMap[status] || status;
};

export const getStatusClass = (status) => {
  const classMap = {
    'pending_tutor': 'pending',
    'pending_hod': 'pending',
    'pending_principal': 'pending',
    'approved': 'approved',
    'rejected': 'rejected'
  };
  return classMap[status] || 'unknown';
};
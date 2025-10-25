import { useState, useEffect } from 'react';
import { getPendingStudentsRequest, getApprovedStudentsRequest, approveOrRejectStudentRequest } from '../api/requests/studentRequest';

const API_BASE = import.meta.env.VITE_BASE_URL;

export const useStudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/students/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/students/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, fetchProfile, updateProfile };
};

export const useStudentForms = () => {
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForms = async (departmentId = null) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const url = departmentId 
        ? `${API_BASE}/shared/forms/?department_id=${departmentId}`
        : `${API_BASE}/shared/forms/`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }

      const data = await response.json();
      setForms(data.forms || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchForm = async (formId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/shared/forms/${formId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch form');
      }

      const data = await response.json();
      setForm(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (formId, formData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/shared/forms/${formId}/submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { forms, form, loading, error, fetchForms, fetchForm, submitForm };
};

export const useStudentSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/shared/submissions/my/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    return {
      totalSubmissions: submissions.length,
      pendingSubmissions: submissions.filter(s => s.status.includes('pending')).length,
      approvedSubmissions: submissions.filter(s => s.status === 'approved').length,
      rejectedSubmissions: submissions.filter(s => s.status === 'rejected').length
    };
  };

  return { submissions, loading, error, fetchSubmissions, getStats };
};

export const useStudentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/students/change-password/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, changePassword };
};

export const useStudent = () => {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const registerStudent = async (studentData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setToast({
        type: 'success',
        message: data.message || 'Registration successful! Please wait for approval.'
      });

      return data;
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/students/list/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      return await response.json();
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveStudent = async (studentId, approvalData) => {
    setLoading(true);
    try {
      const response = await approveOrRejectStudentRequest(studentId, approvalData);
      setToast({
        type: 'success',
        message: response.message || `Student ${approvalData.action}d successfully`
      });
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to process student';
      setToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingStudents = async () => {
    setLoading(true);
    try {
      const response = await getPendingStudentsRequest();
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch pending students';
      setToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedStudents = async () => {
    setLoading(true);
    try {
      const response = await getApprovedStudentsRequest();
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch approved students';
      setToast({
        type: 'error',
        message: errorMessage
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => setToast(null);

  return { 
    registerStudent, 
    listStudents, 
    approveStudent, 
    fetchPendingStudents, 
    fetchApprovedStudents, 
    loading, 
    toast, 
    closeToast 
  };
};

export const useFormSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitForm = async (formId, submissionData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/shared/forms/${formId}/submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, error };
};
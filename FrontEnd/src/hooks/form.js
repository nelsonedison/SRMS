import { useState } from 'react';
import { 
    listFormsRequest, 
    getFormDetailsRequest, 
    createFormRequest, 
    updateFormRequest, 
    deleteFormRequest,
    submitFormRequest,
    getMySubmissionsRequest,
    listSubmissionsRequest,
    reviewSubmissionRequest
} from '../api/requests/formRequest';

export const useForm = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Form operations
    const listForms = async (departmentId = null) => {
        setLoading(true);
        try {
            const response = await listFormsRequest(departmentId);
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch forms';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getFormDetails = async (id) => {
        setLoading(true);
        try {
            const response = await getFormDetailsRequest(id);
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch form details';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createForm = async (formData) => {
        setLoading(true);
        try {
            const response = await createFormRequest(formData);
            setToast({ message: 'Form created successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create form';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateForm = async (id, formData) => {
        setLoading(true);
        try {
            const response = await updateFormRequest(id, formData);
            setToast({ message: 'Form updated successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update form';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteForm = async (id) => {
        setLoading(true);
        try {
            const response = await deleteFormRequest(id);
            setToast({ message: 'Form deleted successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete form';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Submission operations
    const submitForm = async (id, submissionData) => {
        setLoading(true);
        try {
            const response = await submitFormRequest(id, submissionData);
            setToast({ message: 'Form submitted successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to submit form';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getMySubmissions = async () => {
        setLoading(true);
        try {
            const response = await getMySubmissionsRequest();
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch submissions';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listSubmissions = async () => {
        setLoading(true);
        try {
            const response = await listSubmissionsRequest();
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch submissions';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const reviewSubmission = async (id, reviewData) => {
        setLoading(true);
        try {
            const response = await reviewSubmissionRequest(id, reviewData);
            const action = reviewData.action === 'approve' ? 'approved' : 'rejected';
            setToast({ message: `Submission ${action} successfully`, type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to review submission';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const closeToast = () => setToast(null);

    return {
        loading,
        toast,
        closeToast,
        // Form operations
        listForms,
        getFormDetails,
        createForm,
        updateForm,
        deleteForm,
        // Submission operations
        submitForm,
        getMySubmissions,
        listSubmissions,
        reviewSubmission
    };
};
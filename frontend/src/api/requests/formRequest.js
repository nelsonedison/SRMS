import apiClient from '../apiConfig';
import { APIENDPOINTS } from '../endpoints';

// Custom Forms requests
export const listFormsRequest = async (departmentId = null) => {
    try {
        const url = departmentId ? `${APIENDPOINTS.FORMS_LIST}?department_id=${departmentId}` : APIENDPOINTS.FORMS_LIST;
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFormDetailsRequest = async (id) => {
    try {
        const response = await apiClient.get(APIENDPOINTS.FORM_DETAILS(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createFormRequest = async (formData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.FORM_CREATE, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateFormRequest = async (id, formData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.FORM_UPDATE(id), formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteFormRequest = async (id) => {
    try {
        const response = await apiClient.delete(APIENDPOINTS.FORM_DELETE(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Form Submissions requests
export const submitFormRequest = async (id, submissionData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.FORM_SUBMIT(id), submissionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMySubmissionsRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.MY_SUBMISSIONS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listSubmissionsRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.SUBMISSIONS_LIST);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const reviewSubmissionRequest = async (id, reviewData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.SUBMISSION_REVIEW(id), reviewData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
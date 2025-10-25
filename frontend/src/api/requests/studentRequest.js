import apiClient from '../apiConfig';
import { APIENDPOINTS } from '../endpoints';

export const getStudentProfileRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.STUDENT_PROFILE);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPendingStudentsRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.PENDING_STUDENTS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getApprovedStudentsRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.APPROVED_STUDENT);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const approveOrRejectStudentRequest = async (id, actionData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.APPROVE_OR_REJECT_STUDENT(id), actionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
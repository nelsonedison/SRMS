import apiClient from '../apiConfig';
import { APIENDPOINTS } from '../endpoints';

export const loginRequest = async (credentials) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.LOGIN, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const studentRegisterRequest = async (studentData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.STUDENT_REGISTER, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const adminRegisterRequest = async (adminData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.ADMIN_REGISTER, adminData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
import apiClient from '../apiConfig';
import { APIENDPOINTS } from '../endpoints';

export const createTeacherRequest = async (teacherData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.CREATE_TEACHER, teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listTeachersRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.LIST_TEACHERS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTeacherProfileRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.TEACHER_PROFILE);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editTeacherRequest = async (id, teacherData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.EDIT_TEACHER(id), teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTeacherRequest = async (id) => {
    try {
        const response = await apiClient.delete(APIENDPOINTS.DELETE_TEACHER(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};
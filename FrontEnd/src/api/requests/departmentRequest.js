import apiClient from '../apiConfig';
import { APIENDPOINTS } from '../endpoints';

// Department requests
export const listDepartmentsRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.DEPARTMENTS_LIST);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createDepartmentRequest = async (departmentData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.DEPARTMENT_CREATE, departmentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDepartmentRequest = async (id, departmentData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.DEPARTMENT_UPDATE(id), departmentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Course requests
export const listCoursesRequest = async (departmentId = null) => {
    try {
        const url = departmentId ? `${APIENDPOINTS.COURSES_LIST}?department_id=${departmentId}` : APIENDPOINTS.COURSES_LIST;
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCourseRequest = async (courseData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.COURSE_CREATE, courseData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCourseRequest = async (id, courseData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.COURSE_UPDATE(id), courseData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
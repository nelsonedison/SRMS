import { useState } from 'react';
import { 
    listDepartmentsRequest, 
    createDepartmentRequest, 
    updateDepartmentRequest,
    listCoursesRequest,
    createCourseRequest,
    updateCourseRequest
} from '../api/requests/departmentRequest';

export const useDepartment = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    // Department operations
    const listDepartments = async () => {
        setLoading(true);
        try {
            const response = await listDepartmentsRequest();
            setDepartments(response.departments || []);
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch departments';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createDepartment = async (departmentData) => {
        setLoading(true);
        try {
            const response = await createDepartmentRequest(departmentData);
            setToast({ message: 'Department created successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.error || error.message || 'Failed to create department';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateDepartment = async (id, departmentData) => {
        setLoading(true);
        try {
            const response = await updateDepartmentRequest(id, departmentData);
            setToast({ message: 'Department updated successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update department';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Course operations
    const listCourses = async (departmentId = null) => {
        setLoading(true);
        try {
            const response = await listCoursesRequest(departmentId);
            setCourses(response.courses || []);
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch courses';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createCourse = async (courseData) => {
        setLoading(true);
        try {
            const response = await createCourseRequest(courseData);
            setToast({ message: 'Course created successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create course';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateCourse = async (id, courseData) => {
        setLoading(true);
        try {
            const response = await updateCourseRequest(id, courseData);
            setToast({ message: 'Course updated successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update course';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const closeToast = () => setToast(null);

    // Alias for compatibility
    const fetchDepartments = listDepartments;
    const fetchCourses = listCourses;

    return {
        loading,
        toast,
        closeToast,
        departments,
        courses,
        // Department operations
        listDepartments,
        fetchDepartments,
        createDepartment,
        updateDepartment,
        // Course operations
        listCourses,
        fetchCourses,
        createCourse,
        updateCourse
    };
};
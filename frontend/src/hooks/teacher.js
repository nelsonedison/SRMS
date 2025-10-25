import { useState } from 'react';
import { createTeacherRequest, listTeachersRequest, getTeacherProfileRequest, editTeacherRequest, deleteTeacherRequest } from '../api/requests/teacherRequest';

export const useTeacher = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const createTeacher = async (teacherData) => {
        setLoading(true);
        try {
            const response = await createTeacherRequest(teacherData);
            setToast({ message: 'Teacher created successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create teacher';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listTeachers = async () => {
        setLoading(true);
        try {
            const response = await listTeachersRequest();
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch teachers';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getTeacherProfile = async () => {
        setLoading(true);
        try {
            const response = await getTeacherProfileRequest();
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch profile';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const editTeacher = async (id, teacherData) => {
        setLoading(true);
        try {
            const response = await editTeacherRequest(id, teacherData);
            setToast({ message: 'Teacher updated successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update teacher';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteTeacher = async (id) => {
        setLoading(true);
        try {
            const response = await deleteTeacherRequest(id);
            setToast({ message: 'Teacher deleted successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete teacher';
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
        createTeacher,
        listTeachers,
        getTeacherProfile,
        editTeacher,
        deleteTeacher
    };
};
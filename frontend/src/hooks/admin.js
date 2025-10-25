import { useState } from 'react';
import { createAdminRequest, listAdminsRequest, editAdminRequest, deleteAdminRequest } from '../api/requests/adminRequest';

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const createAdmin = async (adminData) => {
        setLoading(true);
        try {
            const response = await createAdminRequest(adminData);
            setToast({ message: 'Admin created successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create admin';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const listAdmins = async () => {
        setLoading(true);
        try {
            const response = await listAdminsRequest();
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch admins';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const editAdmin = async (id, adminData) => {
        setLoading(true);
        try {
            const response = await editAdminRequest(id, adminData);
            setToast({ message: 'Admin updated successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update admin';
            setToast({ message: errorMessage, type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAdmin = async (id) => {
        setLoading(true);
        try {
            const response = await deleteAdminRequest(id);
            setToast({ message: 'Admin deleted successfully', type: 'success' });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message || 'Failed to delete admin';
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
        createAdmin,
        listAdmins,
        editAdmin,
        deleteAdmin
    };
};
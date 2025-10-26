import apiClient from '../apiClient';
import { APIENDPOINTS } from '../endpoints';

export const createAdminRequest = async (adminData) => {
    try {
        const response = await apiClient.post(APIENDPOINTS.CREATE_ADMIN, adminData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listAdminsRequest = async () => {
    try {
        const response = await apiClient.get(APIENDPOINTS.LIST_ADMINS);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const editAdminRequest = async (id, adminData) => {
    try {
        const response = await apiClient.put(APIENDPOINTS.EDIT_ADMIN(id), adminData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAdminRequest = async (id) => {
    try {
        const response = await apiClient.delete(APIENDPOINTS.DELETE_ADMIN(id));
        return response.data;
    } catch (error) {
        throw error;
    }
};
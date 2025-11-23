// api/index.js
// تمامی فراخوانی‌های API به بک‌اند را در اینجا مرکزی می‌کنیم

import axios from 'axios';
import { BACKEND_URL, CURRENT_APP_ID } from '../utils/constants';

// یک نمونه از axios برای تنظیمات پایه
const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- API Calls for Users ---

export const loginUser = async (username, password) => {
    try {
        const response = await api.post(`/users/login`, {
            username,
            password,
            appId: CURRENT_APP_ID
        });
        console.log("API - Fetched Login Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error logging in user:", error);
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await api.get(`/users/${CURRENT_APP_ID}`);
        console.log("API - Fetched Users Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error fetching users:", error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post(`/users/createUser`, { ...userData, appId: CURRENT_APP_ID });
        console.log("API - Created User Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error creating user:", error);
        throw error;
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await api.post(`/users/updateUser`, { ...userData, appId: CURRENT_APP_ID });
        console.log("API - Updated User Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${CURRENT_APP_ID}/${userId}`);
        console.log("API - Deleted User Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error deleting user:", error);
        throw error;
    }
};

export const toggleUserActiveStatus = async (userId, isActive) => {
    try {
        const response = await api.put(`/users/${CURRENT_APP_ID}/${userId}/toggle-active`, { isActive });
        console.log("API - Toggled User Active Status Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error toggling user active status:", error);
        throw error;
    }
};

// --- API Calls for Tasks ---

export const fetchTasks = async () => {
    try {
        const response = await api.get(`/tasks/${CURRENT_APP_ID}`);
        console.log("API - Fetched Tasks Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error fetching tasks:", error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await api.post(`/tasks/${CURRENT_APP_ID}`, taskData);
        console.log("API - Created Task Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error creating task:", error);
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        const response = await api.put(`/tasks/${CURRENT_APP_ID}/${taskId}`, taskData);
        console.log("API - Updated Task Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error updating task:", error);
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await api.delete(`/tasks/${CURRENT_APP_ID}/${taskId}`);
        console.log("API - Deleted Task Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error deleting task:", error);
        throw error;
    }
};

// --- API Calls for Report Links ---

export const fetchReportLinks = async () => {
    try {
        const response = await api.get(`/reportLinks/${CURRENT_APP_ID}`);
        console.log("API - Fetched Report Links Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error fetching report links:", error);
        throw error;
    }
};

export const createReportLink = async (linkData) => {
    try {
        const response = await api.post(`/reportLinks/${CURRENT_APP_ID}`, linkData);
        console.log("API - Created Report Link Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error creating report link:", error);
        throw error;
    }
};

export const updateReportLink = async (linkId, linkData) => {
    try {
        const response = await api.put(`/reportLinks/${CURRENT_APP_ID}/${linkId}`, linkData);
        console.log("API - Updated Report Link Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error updating report link:", error);
        throw error;
    }
};

export const deleteReportLink = async (linkId) => {
    try {
        const response = await api.delete(`/reportLinks/${CURRENT_APP_ID}/${linkId}`);
        console.log("API - Deleted Report Link Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error deleting report link:", error);
        throw error;
    }
};

// --- API Calls for Report Sub-Categories ---

export const fetchSubCategories = async () => {
    try {
        const response = await api.get(`/reportSubCategories/${CURRENT_APP_ID}`);
        console.log("API - Fetched Sub Categories Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error fetching sub categories:", error);
        throw error;
    }
};

export const createSubCategory = async (subCategoryData) => {
    try {
        const response = await api.post(`/reportSubCategories/${CURRENT_APP_ID}`, subCategoryData);
        console.log("API - Created Sub Category Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error creating sub category:", error);
        throw error;
    }
};

export const updateSubCategory = async (subCategoryId, subCategoryData) => {
    try {
        const response = await api.put(`/reportSubCategories/${CURRENT_APP_ID}/${subCategoryId}`, subCategoryData);
        console.log("API - Updated Sub Category Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error updating sub category:", error);
        throw error;
    }
};

export const deleteSubCategory = async (subCategoryId) => {
    try {
        const response = await api.delete(`/reportSubCategories/${CURRENT_APP_ID}/${subCategoryId}`);
        console.log("API - Deleted Sub Category Data:", response.data); // Added console.log
        return response.data;
    } catch (error) {
        console.error("API - Error deleting sub category:", error);
        throw error;
    }
};

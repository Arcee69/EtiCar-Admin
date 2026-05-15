import type { AdminPayload } from "../types/global"
import {SUSPEND_ADMINS, GET_ADMINS } from "./api"
import apiInstance from "./instance"


// API functions for roles and permissions
export const rolesAndPermissionsApi = {
    // Get admins data
    getAdmins: async () => {
        const response = await apiInstance.get(`${GET_ADMINS}`)
        return response.data.data
    },
    // Create a new admin
    createAdmin: async (payload: AdminPayload) => {
        const response = await apiInstance.post(`${GET_ADMINS}`, payload)
        return response.data.data
    },
    // Suspend admin
    suspendAdmin: async (adminId: string) => {
        const response = await apiInstance.delete(`${SUSPEND_ADMINS}/${adminId}`)
        return response.data.data
    },
    //Assign Admin to Role
    reassignAdminToRole: async (roleName: string, userId: string) => {
        const response = await apiInstance.post(`${GET_ADMINS}/${roleName}/assign/${userId}`)
        return response.data.data
    },
    //Remove Admin from Role
    removeAdminFromRole: async (role: string, userId: string) => {
        const response = await apiInstance.delete(`${GET_ADMINS}/${role}/users/${userId}`)
        return response.data.data
    },
    //Get Role Details
    getRoleDetails: async (roleName: string) => {
        const response = await apiInstance.get(`${GET_ADMINS}/${roleName}`)
        return response.data.data
    },

}

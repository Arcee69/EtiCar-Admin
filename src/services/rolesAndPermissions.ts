import type { RolePayload } from "../types/global"
import { GET_PERMISSIONS, GET_ROLES } from "./api"
import apiInstance from "./instance"


// API functions for roles and permissions
export const rolesAndPermissionsApi = {
    // Get roles data
    getRoles: async () => {
        const response = await apiInstance.get(`${GET_ROLES}`)
        return response.data.data
    },
    // Create a new role
    createRole: async (payload: RolePayload) => {
        const response = await apiInstance.post(`${GET_ROLES}`, payload)
        return response.data.data
    },
    // Get permissions data
    getPermissions: async () => {
        const response = await apiInstance.get(`${GET_PERMISSIONS}`)
        return response.data.data
    },
    // Update role
    updateRoles: async (roleId: string, payload: RolePayload) => {
        const response = await apiInstance.put(`${GET_ROLES}/${roleId}`, payload)
        return response.data.data
    },
    // Delete role
    deleteRole: async (roleId: string) => {
        const response = await apiInstance.delete(`${GET_ROLES}/${roleId}`)
        return response.data.data
    },
    //Assign User to Role
    assignUserToRole: async (roleId: string, userId: string) => {
        const response = await apiInstance.post(`${GET_ROLES}/${roleId}/assign-user`, { user_uuid: userId })
        return response.data.data
    },
    //Remove User from Role
    removeUserFromRole: async (roleId: string, userId: string) => {
        const response = await apiInstance.post(`${GET_ROLES}/${roleId}/remove-user`, { user_uuid: userId })
        return response.data.data
    },
    //Get Role Details
    getRoleDetails: async (roleId: string) => {
        const response = await apiInstance.get(`${GET_ROLES}/${roleId}`)
        return response.data.data
    },

}

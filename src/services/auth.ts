import apiInstance from './instance';
import { LOGIN, LOGOUT, CHANGE_PASSWORD } from './api';
import type { LoginPayload, LoginResponse, ChangePasswordPayload } from '../types/global';

export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiInstance.post<LoginResponse>(LOGIN, payload);
  return response.data;
};

export const logoutAdmin = async (): Promise<void> => {
  await apiInstance.post(LOGOUT);
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<{ status: boolean; message: string }> => {
  const response = await apiInstance.post<{ status: boolean; message: string }>(CHANGE_PASSWORD, payload);
  return response.data;
};

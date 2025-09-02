import { apiClient } from '../config';
import { USER_ENDPOINTS } from '../endpoints';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  designation: string;
  phone_number?: string;
  profile_pic?: string;
  is_active: boolean;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  company?: string;
  designation?: string;
  phone_number?: string;
}

export const userService = {
  // Get user profile
  getProfile: async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get<{ status: number; data: UserProfile }>(`${USER_ENDPOINTS.GET_PROFILE}/${userId}`);
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<any> => {
    const response = await apiClient.put(USER_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  // Update profile picture
  updateProfilePicture: async (formData: FormData): Promise<any> => {
    const response = await apiClient.post(USER_ENDPOINTS.UPDATE_PROFILE_PIC, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Remove profile picture
  removeProfilePicture: async (userId: string): Promise<any> => {
    const response = await apiClient.delete(`${USER_ENDPOINTS.REMOVE_PROFILE_PHOTO}/${userId}`);
    return response.data;
  },

  // Get user status
  getUserStatus: async (): Promise<any> => {
    const response = await apiClient.get(USER_ENDPOINTS.GET_USER_STATUS);
    return response.data;
  },

  // Update email
  updateEmail: async (data: { new_email: string }): Promise<any> => {
    const response = await apiClient.post(USER_ENDPOINTS.UPDATE_EMAIL, data);
    return response.data;
  },

  // Verify email update OTP
  verifyEmailUpdateOTP: async (data: { email: string; otp: string }): Promise<any> => {
    const response = await apiClient.post(USER_ENDPOINTS.UPDATE_EMAIL_OTP, data);
    return response.data;
  },

  // Update phone number
  updatePhoneNumber: async (data: { new_phone_number: string }): Promise<any> => {
    const response = await apiClient.post(USER_ENDPOINTS.UPDATE_PHONE, data);
    return response.data;
  },

  // Verify phone update OTP
  verifyPhoneUpdateOTP: async (data: { phone_number: string; otp: string }): Promise<any> => {
    const response = await apiClient.post(USER_ENDPOINTS.UPDATE_PHONE_OTP, data);
    return response.data;
  },
};

export default userService;

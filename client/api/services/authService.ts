import { apiClient, API_ENDPOINTS, ApiResponse } from '../config';
import { z } from 'zod';

// Type definitions for authentication
export interface LoginCredentials {
  username: string;
  password: string;
  captcha?: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string; // email
  phone_number: string;
  company: string;
  password: string;
  re_password: string;
  designation?: string;
  workAddress?: string;
  country?: string;
  linkedIn?: string;
  latitude?: string;
  longitude?: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface PasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  token: string;
  uid: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  company?: string;
  phone_number?: string;
  designation?: string;
  profile_pic?: string;
  token?: string;
}

// Validation schemas
export const loginSchema = z.object({
  username: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  captcha: z.string().optional(),
});

export const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  re_password: z.string(),
  designation: z.string().min(1, 'Designation is required'),
  workAddress: z.string().optional(),
  country: z.string().optional(),
  linkedIn: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
}).refine((data) => data.password === data.re_password, {
  message: "Passwords don't match",
  path: ["re_password"],
});

export const emailVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const otpVerificationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z.string().min(4, 'OTP must be 4 digits').max(4, 'OTP must be 4 digits'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  re_password: z.string(),
}).refine((data) => data.password === data.re_password, {
  message: "Passwords don't match",
  path: ["re_password"],
});

// Authentication Service Class
class AuthService {
  // Store auth token
  private setAuthToken(token: string, refreshToken?: string): void {
    localStorage.setItem('valasys_auth_token', token);
    if (refreshToken) {
      localStorage.setItem('valasys_refresh_token', refreshToken);
    }
  }

  // Get auth token
  private getAuthToken(): string | null {
    return localStorage.getItem('valasys_auth_token');
  }

  // Clear auth tokens
  private clearAuthTokens(): void {
    localStorage.removeItem('valasys_auth_token');
    localStorage.removeItem('valasys_refresh_token');
    localStorage.removeItem('otpTimerEndTime');
    localStorage.removeItem('otp');
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.data.status === 200) {
        const userData = response.data.data;
        if (userData?.is_active) {
          // Store auth tokens
          if (userData.token) {
            this.setAuthToken(userData.token, userData.refresh_token);
          }
          return {
            status: 200,
            message: response.data.message || 'Login successful',
            data: userData
          };
        } else {
          return {
            status: 401,
            message: 'Account is not active. Complete Email and Phone Verification',
            error: 'inactive_account'
          };
        }
      } else {
        return {
          status: response.data.status || 400,
          message: response.data.message || 'Invalid credentials',
          error: 'login_failed'
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const status = error.response?.status || 500;
      
      if (status === 429) {
        return {
          status: 429,
          message: 'Too many failed login attempts. Try again after 10 minutes.',
          error: 'rate_limited'
        };
      }
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<ApiResponse<{ user_id: number }>> {
    try {
      // Transform phone number
      const transformedData = {
        ...userData,
        phone_number: userData.phone_number ? `+${userData.phone_number}` : '',
        first_name: this.capitalize(userData.first_name),
        last_name: this.capitalize(userData.last_name),
        company: this.capitalize(userData.company),
        designation: userData.designation ? this.capitalize(userData.designation) : '',
      };

      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, transformedData);
      
      if (response.data.status === 200) {
        return {
          status: 200,
          message: response.data.message || 'Registration successful',
          data: response.data.data
        };
      } else {
        return {
          status: response.data.status || 400,
          message: response.data.message || 'Registration failed',
          error: 'registration_failed'
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Verify business email for registration
  async verifyBusinessEmail(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { email });
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'Email verified',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Verify email OTP
  async verifyEmailOTP(data: OTPVerificationData): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL_OTP, data);
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'OTP verified successfully',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Verify phone OTP
  async verifyPhoneOTP(data: OTPVerificationData): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_PHONE_OTP, data);
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'Phone verified successfully',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Phone verification failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Send password reset OTP
  async sendPasswordResetOTP(email: string): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_OTP_SENDER, { email });
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'Reset code sent to your email',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset code';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Verify password reset OTP
  async verifyPasswordResetOTP(data: OTPVerificationData): Promise<ApiResponse<{ token: string; uid: string }>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY_OTP, data);
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'OTP verified successfully',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'OTP verification failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<ApiResponse<any>> {
    try {
      const payload = { password: data.password };
      const response = await apiClient.patch(`${API_ENDPOINTS.AUTH.RESET_PASSWORD}/${data.uid}/${data.token}/`, payload);
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'Password reset successfully',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Resend email OTP
  async resendEmailOTP(payload: { email: string; user_id?: number }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP_EMAIL, payload);
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'OTP sent successfully',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Resend phone OTP
  async resendPhoneOTP(payload: { email: string }): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP_PHONE, payload);
      
      return {
        status: response.data.status || 200,
        message: response.data.message || 'OTP sent successfully',
        data: response.data.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // LinkedIn authentication
  async linkedinAuth(code: string): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LINKEDIN_LOGIN, { code });
      
      if (response.data.status === 200) {
        const userData = response.data.data;
        if (userData.token) {
          this.setAuthToken(userData.token, userData.refresh_token);
        }
        return {
          status: 200,
          message: response.data.message || 'LinkedIn authentication successful',
          data: userData
        };
      } else {
        return {
          status: response.data.status || 400,
          message: response.data.message || 'LinkedIn authentication failed',
          error: 'linkedin_auth_failed'
        };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'LinkedIn authentication failed';
      const status = error.response?.status || 500;
      
      return {
        status,
        message: errorMessage,
        error: 'network_error'
      };
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if needed
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthTokens();
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get current user info from token
  getCurrentUser(): AuthUser | null {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Utility function to capitalize strings
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;

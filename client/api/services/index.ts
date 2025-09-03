// Export services
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as icpService } from './icpService';

// Export types from auth service
export type {
  LoginCredentials,
  RegisterData,
  OTPVerificationData,
  PasswordResetData,
  ResetPasswordData,
  AuthUser,
} from './authService';

// Re-export API client and config helpers
export { apiClient, API_BASE_URL, API_ENDPOINTS } from '../config';

// Provide a simple apiService wrapper for consumers expecting it
export { default as apiService } from '../client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, AuthUser, LoginCredentials, RegisterData, OTPVerificationData, PasswordResetData, ResetPasswordData } from '../../api/services/authService';
import { toast } from 'sonner';

// Types
export interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  // Email verification state
  verifyEmail: {
    regEmailInfo: {
      email: string;
    } | null;
  };
  // OTP verification state
  verifyEmailOtp: {
    emailOtp: {
      email: string;
    } | null;
  };
  // Password reset state
  uidAndToken: {
    token: string;
    uid: string;
  } | null;
  // New user details during registration
  newUserDetails: {
    newUserDetails: RegisterData & { user_id?: number } | null;
  };
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  verifyEmail: {
    regEmailInfo: null
  },
  verifyEmailOtp: {
    emailOtp: null
  },
  uidAndToken: null,
  newUserDetails: {
    newUserDetails: null
  }
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.status === 200 && response.data) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      
      if (response.status === 200 && response.data) {
        toast.success(response.message);
        return { ...userData, user_id: response.data.user_id };
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyBusinessEmail = createAsyncThunk(
  'auth/verifyBusinessEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyBusinessEmail(email);
      
      if (response.status === 200) {
        return { email };
      } else if (response.status === 409) {
        // Handle existing email case
        if (response.data?.redirect) {
          // User exists but not verified, allow to continue to OTP verification
          return { email, redirect: true };
        } else {
          toast.error(response.message);
          return rejectWithValue(response.message);
        }
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Email verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyEmailOTP = createAsyncThunk(
  'auth/verifyEmailOTP',
  async (data: OTPVerificationData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmailOTP(data);
      
      if (response.status === 200) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'OTP verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyPhoneOTP = createAsyncThunk(
  'auth/verifyPhoneOTP',
  async (data: OTPVerificationData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyPhoneOTP(data);
      
      if (response.status === 200) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Phone verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const sendPasswordResetOTP = createAsyncThunk(
  'auth/sendPasswordResetOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.sendPasswordResetOTP(email);
      
      if (response.status === 200) {
        toast.success(response.message);
        return { email };
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to send reset code';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const verifyPasswordResetOTP = createAsyncThunk(
  'auth/verifyPasswordResetOTP',
  async (data: OTPVerificationData, { rejectWithValue }) => {
    try {
      const response = await authService.verifyPasswordResetOTP(data);
      
      if (response.status === 200 && response.data) {
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'OTP verification failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(data);
      
      if (response.status === 200) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Password reset failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resendEmailOTP = createAsyncThunk(
  'auth/resendEmailOTP',
  async (payload: { email: string; user_id?: number }, { rejectWithValue }) => {
    try {
      const response = await authService.resendEmailOTP(payload);
      
      if (response.status === 200) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to resend OTP';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const resendPhoneOTP = createAsyncThunk(
  'auth/resendPhoneOTP',
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const response = await authService.resendPhoneOTP(payload);
      
      if (response.status === 200) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'Failed to resend OTP';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const linkedinAuth = createAsyncThunk(
  'auth/linkedinAuth',
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await authService.linkedinAuth(code);
      
      if (response.status === 200 && response.data) {
        toast.success(response.message);
        return response.data;
      } else {
        toast.error(response.message);
        return rejectWithValue(response.message);
      }
    } catch (error: any) {
      const message = error?.message || 'LinkedIn authentication failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      toast.info('You have been logged out');
      return null;
    } catch (error: any) {
      const message = error?.message || 'Logout failed';
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTokenAndUid: (state, action: PayloadAction<{ token: string; uid: string }>) => {
      state.uidAndToken = action.payload;
    },
    clearAuthState: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.verifyEmail.regEmailInfo = null;
      state.verifyEmailOtp.emailOtp = null;
      state.uidAndToken = null;
      state.newUserDetails.newUserDetails = null;
      state.error = null;
    },
    initializeAuth: (state) => {
      // Check if user is already authenticated on app startup
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user) {
          state.user = user;
          state.isLoggedIn = true;
        }
      }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
        state.user = null;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newUserDetails.newUserDetails = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify business email
    builder
      .addCase(verifyBusinessEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyBusinessEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifyEmail.regEmailInfo = { email: action.payload.email };
        state.error = null;
      })
      .addCase(verifyBusinessEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send password reset OTP
    builder
      .addCase(sendPasswordResetOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPasswordResetOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.verifyEmailOtp.emailOtp = { email: action.payload.email };
        state.error = null;
      })
      .addCase(sendPasswordResetOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify password reset OTP
    builder
      .addCase(verifyPasswordResetOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPasswordResetOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uidAndToken = action.payload;
        state.error = null;
      })
      .addCase(verifyPasswordResetOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.uidAndToken = null;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // LinkedIn auth
    builder
      .addCase(linkedinAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(linkedinAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(linkedinAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.verifyEmail.regEmailInfo = null;
        state.verifyEmailOtp.emailOtp = null;
        state.uidAndToken = null;
        state.newUserDetails.newUserDetails = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Handle all loading states for other actions
    builder
      .addCase(verifyEmailOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyEmailOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(verifyPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resendEmailOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendEmailOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendEmailOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resendPhoneOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendPhoneOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendPhoneOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setTokenAndUid, clearAuthState, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectVerifyEmail = (state: { auth: AuthState }) => state.auth.verifyEmail;
export const selectVerifyEmailOtp = (state: { auth: AuthState }) => state.auth.verifyEmailOtp;
export const selectUidAndToken = (state: { auth: AuthState }) => state.auth.uidAndToken;
export const selectNewUserDetails = (state: { auth: AuthState }) => state.auth.newUserDetails;

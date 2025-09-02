import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  operationType: string | null;
}

const initialState: LoadingState = {
  isLoading: false,
  loadingMessage: '',
  operationType: null,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ isLoading: boolean; message?: string; type?: string }>) => {
      state.isLoading = action.payload.isLoading;
      state.loadingMessage = action.payload.message || '';
      state.operationType = action.payload.type || null;
    },
    clearLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = '';
      state.operationType = null;
    },
  },
});

export const { setLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ICPScoreState {
  icpScore: any;
  data: any[];
  filters: any;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

const initialState: ICPScoreState = {
  icpScore: null,
  data: [],
  filters: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
  },
};

const icpScoreSlice = createSlice({
  name: 'icpScore',
  initialState,
  reducers: {
    setICPScore: (state, action: PayloadAction<any>) => {
      state.icpScore = action.payload;
    },
    setICPData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
    setICPFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },
    setPagination: (state, action: PayloadAction<any>) => {
      state.pagination = action.payload;
    },
    clearICPScore: (state) => {
      state.icpScore = null;
      state.data = [];
      state.filters = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0,
      };
    },
  },
});

export const { setICPScore, setICPData, setICPFilters, setPagination, clearICPScore } = icpScoreSlice.actions;
export default icpScoreSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IntentRangesState {
  intentRange: any[];
  selectedRanges: any[];
}

const initialState: IntentRangesState = {
  intentRange: [],
  selectedRanges: [],
};

const intentRangesSlice = createSlice({
  name: 'intentRanges',
  initialState,
  reducers: {
    setIntentRanges: (state, action: PayloadAction<any[]>) => {
      state.intentRange = action.payload;
    },
    setSelectedRanges: (state, action: PayloadAction<any[]>) => {
      state.selectedRanges = action.payload;
    },
    clearIntentRanges: (state) => {
      state.intentRange = [];
      state.selectedRanges = [];
    },
  },
});

export const { setIntentRanges, setSelectedRanges, clearIntentRanges } = intentRangesSlice.actions;
export default intentRangesSlice.reducer;

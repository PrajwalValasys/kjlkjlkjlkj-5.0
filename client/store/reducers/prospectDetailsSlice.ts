import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProspectDetailsState {
  prospectDetails: any;
  searchResults: any[];
  filters: any;
}

const initialState: ProspectDetailsState = {
  prospectDetails: null,
  searchResults: [],
  filters: null,
};

const prospectDetailsSlice = createSlice({
  name: 'prospectDetails',
  initialState,
  reducers: {
    setProspectDetails: (state, action: PayloadAction<any>) => {
      state.prospectDetails = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<any[]>) => {
      state.searchResults = action.payload;
    },
    setProspectFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },
    clearProspectDetails: (state) => {
      state.prospectDetails = null;
      state.searchResults = [];
      state.filters = null;
    },
  },
});

export const { setProspectDetails, setSearchResults, setProspectFilters, clearProspectDetails } = prospectDetailsSlice.actions;
export default prospectDetailsSlice.reducer;

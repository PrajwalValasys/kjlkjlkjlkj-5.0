import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GeoLocationState {
  geolocation: any[];
  selectedLocations: any[];
}

const initialState: GeoLocationState = {
  geolocation: [],
  selectedLocations: [],
};

const geoLocationSlice = createSlice({
  name: 'geoLocation',
  initialState,
  reducers: {
    setGeoLocation: (state, action: PayloadAction<any[]>) => {
      state.geolocation = action.payload;
    },
    setSelectedLocations: (state, action: PayloadAction<any[]>) => {
      state.selectedLocations = action.payload;
    },
    clearGeoLocation: (state) => {
      state.geolocation = [];
      state.selectedLocations = [];
    },
  },
});

export const { setGeoLocation, setSelectedLocations, clearGeoLocation } = geoLocationSlice.actions;
export default geoLocationSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CampaignsState {
  campaigns: any[];
  currentCampaign: any;
  campaignGraphData: any;
}

const initialState: CampaignsState = {
  campaigns: [],
  currentCampaign: null,
  campaignGraphData: null,
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setCampaigns: (state, action: PayloadAction<any[]>) => {
      state.campaigns = action.payload;
    },
    setCurrentCampaign: (state, action: PayloadAction<any>) => {
      state.currentCampaign = action.payload;
    },
    setCampaignGraphData: (state, action: PayloadAction<any>) => {
      state.campaignGraphData = action.payload;
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
      state.currentCampaign = null;
      state.campaignGraphData = null;
    },
  },
});

export const { setCampaigns, setCurrentCampaign, setCampaignGraphData, clearCampaigns } = campaignsSlice.actions;
export default campaignsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSubscriptionState {
  userSubscrptionData: any;
  plans: any[];
  currentPlan: any;
}

const initialState: UserSubscriptionState = {
  userSubscrptionData: null,
  plans: [],
  currentPlan: null,
};

const userSubscriptionSlice = createSlice({
  name: 'userSubscription',
  initialState,
  reducers: {
    setUserSubscriptionData: (state, action: PayloadAction<any>) => {
      state.userSubscrptionData = action.payload;
    },
    setPlans: (state, action: PayloadAction<any[]>) => {
      state.plans = action.payload;
    },
    setCurrentPlan: (state, action: PayloadAction<any>) => {
      state.currentPlan = action.payload;
    },
    clearSubscriptionData: (state) => {
      state.userSubscrptionData = null;
      state.plans = [];
      state.currentPlan = null;
    },
  },
});

export const { setUserSubscriptionData, setPlans, setCurrentPlan, clearSubscriptionData } = userSubscriptionSlice.actions;
export default userSubscriptionSlice.reducer;

import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import loadingReducer from './loadingSlice';
import icpScoreReducer from './icpScoreSlice';
import prospectDetailsReducer from './prospectDetailsSlice';
import userSubscriptionReducer from './userSubscriptionSlice';
import geoLocationReducer from './geoLocationSlice';
import intentRangesReducer from './intentRangesSlice';
import campaignsReducer from './campaignsSlice';
import notificationsReducer from './notificationsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  loading: loadingReducer,
  icpScore: icpScoreReducer,
  prospectDetails: prospectDetailsReducer,
  userSubscription: userSubscriptionReducer,
  geoLocation: geoLocationReducer,
  intentRanges: intentRangesReducer,
  campaigns: campaignsReducer,
  notifications: notificationsReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;

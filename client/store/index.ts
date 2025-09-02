import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createEncryptTransform } from './encryption';
import rootReducer from './reducers';

// Create encryption transform
const encryptTransform = createEncryptTransform();

// Persist configuration with encryption
const persistConfig = {
  key: 'vais-root',
  storage,
  version: 1,
  transforms: [encryptTransform],
  blacklist: ['loading'], // Don't persist loading state
  whitelist: [
    'user',
    'auth',
    'icpScore',
    'prospectDetails',
    'userSubscription',
    'geoLocation',
    'intentRanges',
    'campaigns',
    'notifications'
  ],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register', 'rehydrate'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store setup function for backward compatibility
export default () => {
  return { store, persistor };
};

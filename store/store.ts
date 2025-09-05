import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { contentApi } from './api/contentApi';
import preferencesReducer from './slices/preferencesSlice';
import contentReducer from './slices/contentSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    [contentApi.reducerPath]: contentApi.reducer,
    preferences: preferencesReducer,
    content: contentReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(contentApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
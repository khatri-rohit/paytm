import { configureStore } from '@reduxjs/toolkit';
import reducers from './slices/userSlice';

export const store = configureStore({
    reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
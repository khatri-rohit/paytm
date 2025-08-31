import { configureStore } from '@reduxjs/toolkit';
import paytmReducer from './slices/paytmSlice';
import { bankApi } from './services/bankApi';

export const store = configureStore({
    reducer: {
        paytm: paytmReducer,
        [bankApi.reducerPath]: bankApi.reducer
    },
    middleware: (getDefault) => getDefault().concat(bankApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
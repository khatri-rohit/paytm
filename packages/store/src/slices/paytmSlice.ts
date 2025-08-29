import { createSlice } from '@reduxjs/toolkit';

export interface User {
    name: string;
    age: number;
    email: string;
    address: string;
    phone: string;
}

export interface P2PTransaction {
    name: string;
    amount: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    description: string;
    timestamp: string;
}

const initialState = {
    user: null as User | null,
    p2pTransaction: null as P2PTransaction | null
};

export const paytmSlice = createSlice({
    name: 'paytm',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setP2PTransactions: (state, action) => {
            state.p2pTransaction = action.payload;
        }
    },
});

export const { setUser, setP2PTransactions } = paytmSlice.actions;

export default paytmSlice.reducer;
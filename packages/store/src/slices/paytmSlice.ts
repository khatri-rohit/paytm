import { createSlice } from '@reduxjs/toolkit';

export interface User {
    name: string;
    age: number;
    email: string;
    address: string;
    phone: string;
}

export interface P2PItem {
    id: number | string;
    amount: string | number;
    timestamp?: string | Date;
    fromUserId?: number | string;
    senderName?: string | null;
    receiverName?: string | null;
    status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | string;
}

interface InitialState {
    user: User | null;
    p2pTransaction: P2PItem[] | null;
    bankHistory: any[];
}

const initialState: InitialState = {
    user: null,
    p2pTransaction: [],
    bankHistory: []
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
        },
        setBankHistory: (state, action) => {
            state.bankHistory = action.payload;
        },
    },
});

export const { setUser, setP2PTransactions, setBankHistory } = paytmSlice.actions;

export default paytmSlice.reducer;
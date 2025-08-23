import { createSlice } from '@reduxjs/toolkit';

export interface User {
    name: string;
    age: number;
    email: string;
    address: string;
    phone: string;
}

const initialState: User = {
    name: 'Rohit',
    age: 25,
    email: 'rohit@paytm.com',
    address: 'Delhi',
    phone: '9876543210',
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.age = action.payload.age;
            state.email = action.payload.email;
            state.address = action.payload.address;
            state.phone = action.payload.phone;
        },
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
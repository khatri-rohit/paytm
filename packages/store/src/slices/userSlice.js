"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUser = exports.userSlice = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    name: 'Rohit',
    age: 25,
    email: 'rohit@paytm.com',
    address: 'Delhi',
    phone: '9876543210',
};
exports.userSlice = (0, toolkit_1.createSlice)({
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
exports.setUser = exports.userSlice.actions.setUser;
exports.default = exports.userSlice.reducer;

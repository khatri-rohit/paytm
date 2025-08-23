export interface User {
    name: string;
    age: number;
    email: string;
    address: string;
    phone: string;
}
export declare const userSlice: import("@reduxjs/toolkit").Slice<User, {
    setUser: (state: import("immer").WritableDraft<User>, action: {
        payload: any;
        type: string;
    }) => void;
}, "user", "user", import("@reduxjs/toolkit").SliceSelectors<User>>;
export declare const setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<any, "user/setUser">;
declare const _default: import("redux").Reducer<User>;
export default _default;
//# sourceMappingURL=userSlice.d.ts.map
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, P2PItem } from '../slices/paytmSlice';
import { setP2PTransactions, setBankHistory } from '../slices/paytmSlice';

const baseUrl = process.env.NEXT_PUBLIC_BANK_API_URL || 'http://localhost:3000/api';

export const bankApi = createApi({
    reducerPath: 'bankApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ['User', 'P2P', 'on-ramp'],
    endpoints: (builder) => ({
        getUserById: builder.query<User, number>({
            query: (id) => `/user/${id}`,
            providesTags: (_res, _err, id) => [{ type: 'User', id }],
        }),
        createBankTransfer: builder.mutation<{ success: boolean, message: string, transaction: any, error?: string; }, { userId: string, bankId: number, token: string, amount: string; }>({
            query: (body) => ({
                url: '/ramptranc',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['on-ramp'],
        }),
        createP2PTransfer: builder.mutation<{ success: boolean; message: string; error?: string; },
            { amount: number; password: string; description: string; number: string; }>({
                query: (body) => ({
                    url: '/bank/transfer',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: ['P2P'],
            }),
        getP2PHistory: builder.query<{ data: P2PItem[]; success: boolean; }, null>({
            query: () => `/p2ptransaction`,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setP2PTransactions({ data }));
                } catch (error) {
                    const err = error as Error;
                    console.error('Error fetching P2P transactions:', err.message);
                }
            },
            providesTags: ['P2P'],
        }),
        getBankHistory: builder.query<{ data: any[]; success: boolean; }, null>({
            query: () => `/ramptranc`,
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setBankHistory({ data }));
                } catch (error) {
                    const err = error as Error;
                    console.error('Error fetching bank history:', err.message);
                }
            },
            providesTags: ['on-ramp'],
        }),
    }),
});

export const {
    useCreateP2PTransferMutation,
    useCreateBankTransferMutation,
    useGetUserByIdQuery,
    useGetP2PHistoryQuery,
    useGetBankHistoryQuery,
} = bankApi;
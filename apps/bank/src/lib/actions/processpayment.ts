"use server";

import { prisma } from '@repo/db';
import { getCurrentDate } from '../getFormatedDate';

export const processpayment = async (onRampTransaction: any) => {
    try {
        const amount = onRampTransaction.amount;
        const transaction = await prisma.onRampTransaction.findUnique({
            where: {
                id: onRampTransaction.id
            }
        });

        if (!transaction) {
            throw new Error("OnRamp Transation not found");
        }

        if (amount !== transaction.amount.toString()) {
            throw new Error("Mismatch Amount");
        }

        const bankTrnasfrer = await fetch('http://localhost:5500/api/bank/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...onRampTransaction }),
        });
        const result = await bankTrnasfrer.json();
        if (!bankTrnasfrer.ok || result?.success === false) {
            throw new Error(result?.message || 'Failed to process payment');
        }
        console.log("Transaction Successfuly", transaction);

        return true;
    }
    catch (err) {
        console.error(err);
    }

};
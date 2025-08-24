"use server";
import { prisma } from '@repo/db';

export const processpayment = async (amount: string, onRampTransactionId: number) => {
    try {
        const transaction = await prisma.onRampTransaction.findUnique({
            where: {
                id: onRampTransactionId
            }
        });

        if (!transaction) {
            console.log("Transaction not found");
            return false;
        }

        if (amount !== transaction.amount.toString()) {
            return false;
        }

        await prisma.onRampTransaction.update({
            where: {
                id: onRampTransactionId
            },
            data: {
                processing: 'SUCCESS'
            }
        });
        console.log('Transaction processed successfully');
        return true;
    }
    catch (err) {
        console.error(err);
    }

};
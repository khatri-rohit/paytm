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

        if (result.success) {
            const onRampTransaction = await prisma.onRampTransaction.update({
                where: {
                    id: transaction.id
                },
                data: {
                    processing: "SUCCESS",
                    updatedAt: getCurrentDate()
                }
            });
        }
        console.log("Transaction Successfuly");

        return true;
        // await prisma.onRampTransaction.update({
        //     where: {
        //         id: onRampTransaction.id
        //     },
        //     data: {
        //         processing: 'SUCCESS',
        //         updatedAt: getCurrentDate()
        //     }
        // });

        // const balance = await prisma.balance.findUnique({
        //     where: {
        //         userId: onRampTransaction.userId
        //     }
        // });

        // if (!balance) {
        //     throw new Error("Sender Bank not Found");
        // }

        // await prisma.balance.update({
        //     where: {
        //         id: balance.id,
        //     },
        //     data: {
        //         amount: (Number(balance.amount) - Number(amount)).toString()
        //     }
        // });

        // const receiverBank = await prisma.balance.findUnique({
        //     where: {
        //         id: onRampTransaction.bankId
        //     }
        // });

        // if (!receiverBank) {
        //     throw new Error("Recevier Bank not Found");
        // }

        // await prisma.balance.update({
        //     where: {
        //         id: receiverBank.id
        //     },
        //     data: {
        //         amount: (Number(receiverBank.amount) + Number(amount)).toString()
        //     }
        // });

        // console.log('Transaction processed successfully');
        // return true;
    }
    catch (err) {
        console.error(err);
    }

};
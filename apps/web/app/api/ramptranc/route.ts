import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../lib/getFormatedDate';

export async function POST(req: Request) {
    try {
        const { userId, bankId, token, amount } = await req.json();
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            });
        }

        const bank = await prisma.balance.findUnique({
            where: {
                id: Number(bankId)
            }
        });

        if (!bank) {
            return NextResponse.json({
                success: false,
                message: "Invalid Bank Id"
            });
        }

        const transaction = await prisma.onRampTransaction.create({
            data: {
                userId: Number(userId),
                token,
                amount,
                processing: 'PROCESSING',
                createdAt: getCurrentDate()
            }
        });
        console.log("Transaction Created Successfully");
        return NextResponse.json({
            success: true,
            message: "Transaction created successfully",
            transaction: { ...transaction, bankId: bank.id }
        });
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: err.message
        });
    }
}
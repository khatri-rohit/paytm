import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../lib/getFormatedDate';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
    try {
        const { userId, bankId, token, amount } = await req.json();
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        });
        console.log(user);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found'
            }, { status: 404 });
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
            }, { status: 404 });
        }

        if (user.bankId === bank.id) {
            return NextResponse.json({
                success: false,
                message: "User cannot use the same bank account"
            }, { status: 400 });
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
        revalidateTag('on-ramp');
        console.log("Transaction Created Successfully...", transaction);
        return NextResponse.json({
            success: true,
            message: "Transaction created successfully",
            transaction: { ...transaction, bankId: bank.id }
        }, { status: 201 });
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: err.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = Number(session.user.id);
        const items = await prisma.onRampTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            message: 'Fetched on-ramp transactions successfully',
            data: items
        }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching on-ramp history:', err.message);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch on-ramp history'
        }, { status: 500 });
    }
}
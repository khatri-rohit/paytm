import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../lib/getFormatedDate';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

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
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching on-ramp history:', err.message);
        return NextResponse.json({ success: false, message: 'Failed to fetch on-ramp history' }, { status: 500 });
    }
}
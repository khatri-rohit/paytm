import { authOptions } from '@/app/lib/auth';
import { prisma } from '@repo/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const history = await prisma.transactionHistory.findMany({
            where: {
                userId: Number(userId)
            },
            orderBy: { createdAt: 'desc' }
        });
        console.log("Fetched transaction history:", history);
        return NextResponse.json({
            success: true,
            message: "Transaction history fetched successfully",
            data: history
        }, { status: 200 });

    } catch (error) {
        const err = error as Error;
        console.error('Error fetching transaction history:', err.message);
        return NextResponse.json({ success: false, message: 'Failed to fetch transaction history' }, { status: 500 });
    }

}
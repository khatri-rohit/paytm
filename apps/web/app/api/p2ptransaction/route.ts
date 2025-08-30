import { authOptions } from '@/app/lib/auth';
import { prisma } from '@repo/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        const getP2PTransactions = await prisma.p2PTransfer.findMany({
            where: {
                OR: [
                    { fromUserId: Number(userId) },
                    { toUserId: Number(userId) }
                ]
            },
            orderBy: { timestamp: 'desc' },
        });

        // console.log("Fetched P2P transactions:", getP2PTransactions);

        return NextResponse.json({
            success: true,
            message: "Fetched P2P transactions successfully",
            data: getP2PTransactions
        });
    } catch (error) {
        const err = error as Error;
        console.error('Error fetching P2P transactions:', err.message);
        return NextResponse.json({ success: false, message: 'Failed to fetch transactions' }, { status: 500 });
    }
} 
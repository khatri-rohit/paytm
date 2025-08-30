import { authOptions } from '@/app/lib/auth';
import { prisma } from '@repo/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export const data = [
    ['Year', 'Debit', 'Credit'],
    ['2004', 1000, 400],
    ['2005', 1170, 460],
    ['2006', 660, 1120],
    ['2007', 1030, 540],
    ['2008', 1230, 640],
    ['2009', 1430, 740],
    ['2010', 1130, 1040],
    ['2011', 1600, 660],
];

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

        const grouped = new Map<string, { debit: number; credit: number; }>();

        for (const item of history) {
            const key = new Date(item.createdAt).toISOString().slice(0, 10);
            const amount = Number(item.amount) || 0;
            const entry = String(item.entryType).toUpperCase();

            const bucket = grouped.get(key) ?? { debit: 0, credit: 0 };
            if (entry === 'DEBIT') {
                bucket.debit += amount;
            } else if (entry === 'CREDIT') {
                bucket.credit += amount;
            }
            grouped.set(key, bucket);
        }

        const chartHeader = ['Date', 'Debit', 'Credit'] as const;
        const rows = Array.from(grouped.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, sums]) => [date, sums.debit, sums.credit]);

        const chartData = [chartHeader, ...rows];

        return NextResponse.json({
            success: true,
            message: "Transaction history fetched successfully",
            data: chartData
        }, { status: 200 });

    } catch (error) {
        const err = error as Error;
        console.error('Error fetching transaction history:', err.message);
        return NextResponse.json({ success: false, message: 'Failed to fetch transaction history' }, { status: 500 });
    }

}
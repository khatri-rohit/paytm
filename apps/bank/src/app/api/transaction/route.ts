import { NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const bankId = searchParams.get('info');

    if (!token || !userId || !bankId) {
        return NextResponse.json({ error: 'Invalid token or userId' });
    }

    try {
        const transaction = await prisma.onRampTransaction.findUnique({
            where: {
                id: Number(userId),
                AND: {
                    token: token,
                }
            }
        });

        if (!transaction) {
            console.log('Transaction not found');
            return NextResponse.json({ error: 'Transaction not found' });
        }

        return NextResponse.json({
            success: true,
            message: "Transaction Found",
            data: { ...transaction, bankId: bankId }
        });
    } catch (err) {
        return NextResponse.json({ error: 'Error fetching transaction' });
    }
}

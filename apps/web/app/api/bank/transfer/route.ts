import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../../lib/getFormatedDate';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Invalid token' });
        }

        const transaction = await prisma.onRampTransaction.update({
            where: {
                token: token
            },
            data: {
                processing: 'SUCCESS',
                updatedAt: getCurrentDate()
            }
        });

        return NextResponse.json({
            success: true,
            message: "OnRamp Transaction Successfully",
            data: transaction
        });
    } catch (err) {
        const error = err as Error;
        console.log(error.message);
        return NextResponse.json({
            success: false,
            error: error.message
        });
    }
}
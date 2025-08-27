import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../../lib/getFormatedDate';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import bycrypt from 'bcryptjs';

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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' });
        }
        const { user } = session;
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' });
        }
        const { amount, number: toNumber, password } = await req.json();

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' });
        }

        if (!toNumber) {
            return NextResponse.json({ error: 'To User Id is required' });
        }

        if (!password) {
            return NextResponse.json({ error: 'Password is required' });
        }

        const formUser = await prisma.user.findUnique({
            where: {
                id: Number(user.id),
            }
        });
        if (!formUser) {
            return NextResponse.json({ error: 'Invalid user ID form session' });
        }
        if (!bycrypt.compare(password, formUser.password)) {
            return NextResponse.json({ error: 'Wrong password' });
        }
        console.log(formUser);

        return NextResponse.json({
            success: true,
            message: 'Transfer created successfully',
            data: formUser
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
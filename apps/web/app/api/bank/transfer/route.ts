import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../../lib/getFormatedDate';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import bcrypt from 'bcryptjs';
import { revalidateTag } from 'next/cache';

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
        console.log("OnRamp Transaction Successfully", transaction);
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
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }
        console.log("----- P2PTransfer -----");
        const { user } = session;
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' });
        }
        const { amount, number: toNumber, password, description } = await req.json();

        if (!amount) {
            return NextResponse.json({ success: false, error: 'Amount is required' });
        }

        if (!toNumber) {
            return NextResponse.json({ success: false, error: 'To User Id is required' });
        }

        if (!password) {
            return NextResponse.json({ success: false, error: 'Password is required' });
        }

        const formUser = await prisma.user.findUnique({
            where: {
                id: Number(user.id),
            }
        });
        // console.log("Form User:", formUser);
        if (!formUser) {
            return NextResponse.json({ success: false, error: 'Invalid user ID form session' });
        }

        if (formUser.number === toNumber.toString()) {
            return NextResponse.json({ success: false, error: 'Cannot transfer to self' });
        }

        const passwordOk = await bcrypt.compare(password, formUser.password);
        if (!passwordOk) {
            return NextResponse.json({ success: false, error: 'Wrong password' });
        }

        const toUser = await prisma.user.findUnique({
            where: {
                number: toNumber.toString()
            }
        });
        // console.log("To User:", toUser);

        if (!toUser) {
            return NextResponse.json({ success: false, error: 'Invalid user ID' });
        }

        console.log("Creating transaction...");
        const transaction = await prisma.p2PTransfer.create({
            data: {
                amount: amount.toString(),
                status: 'PENDING',
                fromUserId: Number(formUser.id),
                toUserId: Number(toUser.id),
                timestamp: getCurrentDate(),
                description: description ? String(description).slice(0, 140) : null,
                receiverName: toUser?.name || 'Unknown',
                senderName: formUser?.name || 'Unknown'
            }
        });
        revalidateTag('p2p-transfer');
        // console.log("Transaction created:", transaction);

        const startTransaction = await fetch('http://localhost:5500/api/transaction/p2ptransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                toUserBankId: toUser.bankId,
                fromUserBankId: formUser.bankId,
                amount: amount.toString(),
                transferId: transaction.id
            })
        });
        console.log("Start Revalidation:");
        revalidateTag('p2p-transfer');

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
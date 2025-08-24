import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // const { userId, token, amount } = await req.json();
        // const user = await prisma.user.findUnique({
        //     where: {
        //         id: Number(userId)
        //     }
        // });

        // if (!user) {
        //     return NextResponse.json({
        //         success: false,
        //         message: 'User not found'
        //     });
        // }

        // const transaction = await prisma.onRampTransaction.create({
        //     data: {
        //         userId: Number(userId),
        //         token,
        //         amount,
        //         // proccesing
        //     }
        // });
        // console.log({
        //     message: 'Transaction created successfully',
        //     transaction
        // });
        // return NextResponse.json(transaction);
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: err.message
        });
    }
}
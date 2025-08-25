import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../../lib/getFormatedDate';

export const POST = async (req: Request) => {
    try {
        const { name, email, number, password } = await req.json();
        const user = await prisma.user.create({
            data: {
                name,
                email,
                number,
                password,
                createdAt: getCurrentDate()
            }
        });
        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user
        });
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        return NextResponse.json({
            success: false,
            message: err.message
        });
    }
};
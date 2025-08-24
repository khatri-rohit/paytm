import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    try {
        const { name, email, number, password } = await req.json();
        const user = await prisma.user.create({
            data: {
                name,
                email,
                number,
                password
            }
        });
        return NextResponse.json(user);
    } catch (error) {
        const err = error as Error;
        console.log(err);
        return NextResponse.json({
            success: false,
            message: err.message
        });
    }
};
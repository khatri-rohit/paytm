import { prisma } from '@repo/db';
import { NextResponse } from 'next/server';
import { getCurrentDate } from '../../../lib/getFormatedDate';
import bcrypt from 'bcryptjs';

export const POST = async (req: Request) => {
    try {
        const { name, email, number, password } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                number,
                isNewUser: true,
                password: hashedPassword,
                createdAt: getCurrentDate()
            }
        });
        console.log("User created successfully");
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
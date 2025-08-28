import { JsonWebTokenError } from 'jsonwebtoken';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {

    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({
            success: false,
            message: 'Invalid token for Webhook',
        }, { status: 400 });
    }





} 
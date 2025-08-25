import { NextResponse } from 'next/server';
import { prisma } from '@repo/db';

export async function POST(req: Request) {

    const { token, userId, bankId } = await req.json();

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

// export async function GET(req: Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const token = searchParams.get('token');

//         if (!token) {
//             return NextResponse.json({ error: 'Invalid token or userId' });
//         }

//         const transaction = await prisma.onRampTransaction.findUnique({
//             where: {
//                 token: token
//             }
//         });

//         if (!transaction) {
//             return NextResponse.json({ error: 'Transaction not found' });
//         }

//         const updateTransaction = await prisma.onRampTransaction.update({
//             where: {
//                 id: transaction.id
//             },
//             data: {
//                 processing: 'SUCCESS',
//                 updatedAt: getCurrentDate()
//             }
//         });
//         console.log(updateTransaction);

//         return NextResponse.json({
//             success: true,
//             message: "OnRamp Transaction Successfully",
//             data: updateTransaction
//         });
//     } catch (err) {
//         const error = err as Error;
//         console.log(error.message);
//         return NextResponse.json({
//             success: false,
//             error: error.message
//         });
//     }


// }
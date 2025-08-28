import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from '@repo/db';
import { JsonWebTokenError, JwtPayload, verify } from 'jsonwebtoken';

dotenv.config();

/*
    This is a webhook application that is used for testing purposes.
    It is not meant to be used in production.
    It is meant to be used as a reference for building a real banking application.
    This is a webhook that is used to simulate how a bank send requests to a webhook.
*/

const app = express();
const port = process.env.PORT || 5501;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/bank/transfer', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        console.log(token);

        if (!token) {
            return res.status(400).send({
                success: false,
                message: 'Invalid token for Webhook',
            });
        }

        // Simulate transfer success
        const verifyOnRampTransaction = await prisma.onRampTransaction.findUnique({
            where: {
                token: token
            }
        });

        if (!verifyOnRampTransaction) {
            return res.status(400).send({
                success: false,
                message: 'Invalid token for Webhook',
            });
        }

        await fetch(`http://localhost:3000/api/bank/transfer?token=${verifyOnRampTransaction.token}`);

        res.send({
            success: true,
            message: 'Transfer created successfully',
        });
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
});

app.post('/api/p2ptransaction', async (req: Request, res: Response) => {

    const { token } = req.body;
    const getToken: JwtPayload = verify(token, process.env.TOKEN_SECRET as string) as { success: boolean; } | JsonWebTokenError;
    console.log(getToken);
    try {

        if (!getToken) {
            return res.status(400).send({
                success: false,
                message: 'Invalied response token from bank',
            });
        }
        console.log(getToken.success === false);
        if (getToken.success === false) {
            const updateTransaction = await prisma.p2PTransfer.update({
                where: { id: Number(getToken.transferId) },
                data: { status: 'FAILED' }
            });
            console.log("Transaction Failed");
            console.log("Token Expired");
            return res.status(400).send({
                success: false,
                message: 'Transaction failed',
            });
        }

        await prisma.p2PTransfer.update({
            where: { id: Number(getToken.transferId) },
            data: { status: 'COMPLETED' }
        });
        console.log("Transaction completed successfully");

        return res.status(200).send({
            success: true,
            message: 'P2P Transaction created successfully',
        });
    } catch (error) {
        const err = error as Error;
        console.log(err.message);
        const updateTransaction = await prisma.p2PTransfer.update({
            where: { id: Number(getToken.transferId) },
            data: { status: 'FAILED' }
        });
        console.log("Transaction Failed");
        return res.status(400).send({
            success: false,
            message: err.message,
        });

    }

});

app.get('/', (req: Request, res: Response) => {
    res.send(`<div style="font-size: 30px; font-weight: bold; background-color: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center;">
        <h1>Webhook</h1>
    </div>`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from '@repo/db';

dotenv.config();

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

app.get('/', (req: Request, res: Response) => {
    res.send(`<div style="font-size: 30px; font-weight: bold; background-color: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center;">
        <h1>Webhook</h1>
    </div>`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
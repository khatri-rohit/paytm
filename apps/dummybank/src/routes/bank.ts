import { Router, Request, Response } from 'express';
import { prisma } from '@repo/db';
import { getCurrentDate } from '../lib/getFromateDate';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const { userId, amount, bankName } = req.body;
        console.log("----- Create Bank -------");
        console.log(userId, amount, bankName);
        const balance = await prisma.balance.create({
            data: {
                userId: Number(userId),
                amount: amount.toString(),
                bankName: bankName,
                createdAt: getCurrentDate()
            }
        });
        console.log("Created Bank Balance");

        const updateUser = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                bankId: Number(balance.id),
                updatedAt: getCurrentDate()
            }
        });
        console.log("User Updated with bankId");
        console.log("----- Complete -------");

        return res.status(200).send({
            success: true,
            message: 'Balance created successfully',
            balance
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

router.post('/transfer', async (req: Request, res: Response) => {
    try {
        const { userId, amount, bankId, id: onRampId } = req.body;
        console.log("------- Transfer Started -------");

        // Check if fromUser exists
        const fromUser = await prisma.user.findUnique({
            where: { id: Number(userId) }
        });

        const toUser = await prisma.user.findUnique({
            where: { bankId: Number(bankId) }
        });

        const fromBalance = await prisma.balance.findUnique({
            where: { userId: Number(userId) }
        });

        const toBalance = await prisma.balance.findUnique({
            where: { userId: Number(toUser.id) }
        });

        // Check if toUser exists
        if (!toBalance) {
            return res.status(404).send({
                success: false,
                message: 'Send balance not found'
            });
        }

        // Check if balance exists
        if (!fromBalance) {
            return res.status(404).send({
                success: false,
                message: 'Reciever balance not found'
            });
        }

        // Check if balance is sufficient
        if (Number(fromBalance.amount) < Number(amount)) {
            return res.status(400).send({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Update balance to sender
        await prisma.balance.update({
            where: {
                userId: Number(userId)
            },
            data: {
                amount: (Number(fromBalance.amount) - Number(amount)).toString(),
                updatedAt: getCurrentDate()
            }
        });
        console.log("sender balance updated");

        // Update balance to reveiver
        await prisma.balance.update({
            where: {
                userId: Number(toUser.id)
            },
            data: {
                amount: (Number(toBalance.amount) + Number(amount)).toString(),
                updatedAt: getCurrentDate()
            }
        });
        console.log("reveiver balance updated");
        console.log('Balance updated successfully');

        await prisma.transactionHistory.create({
            data: {
                userId: Number(userId),
                amount: amount.toString(),
                transactionType: 'TRANSFER_OUT',
                description: `Transfer from ${fromUser?.name}`,
                balanceBefore: fromBalance.amount,
                balanceAfter: (Number(fromBalance.amount) - Number(amount)).toString(),
                referenceId: null,
                createdAt: getCurrentDate()
            }
        });
        console.log("sender transaction created");

        await prisma.transactionHistory.create({
            data: {
                userId: Number(toUser.id),
                amount: amount.toString(),
                transactionType: 'TRANSFER_IN',
                description: `Transfer from ${toUser?.name}`,
                balanceBefore: toBalance.amount,
                balanceAfter: (Number(fromBalance.amount) + Number(amount)).toString(),
                referenceId: null,
                createdAt: getCurrentDate()
            }
        });
        console.log("reveiver transaction created");
        console.log("------- Transfer Completed -------");

        return res.status(200).send({
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

export default router;
import { Router, Request, Response } from 'express';
import { prisma } from '@repo/db';
import { getCurrentDate } from '../lib/getFromateDate';
import { sign } from 'jsonwebtoken';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
    try {
        const { userId, amount, bankName, isNewUser } = req.body;
        console.log("----- Create Bank -------");
        console.log(userId, amount, bankName);

        const transaction = await prisma.$transaction(async (tx: any) => {
            const balance = await tx.balance.create({
                data: {
                    userId: Number(userId),
                    amount: Number(amount).toString(),
                    bankName: bankName,
                    createdAt: getCurrentDate()
                }
            });
            console.log("Created Bank Balance");

            const updateUser = await tx.user.update({
                where: {
                    id: Number(userId)
                },
                data: {
                    bankId: Number(balance.id),
                    isNewUser: isNewUser,
                    updatedAt: getCurrentDate()
                }
            });

            return { balance, updateUser };
        });
        console.log("User Updated with bankId");
        console.log("----- Complete -------");
        console.log(transaction);

        return res.status(200).send({
            success: true,
            message: 'Balance created successfully',
            // balance: transaction.balance
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
        const { userId, amount, bankId, token } = req.body;
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
        console.log("Sender balance updated");

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
        console.log("Reveiver balance updated");
        console.log('Balance updated successfully');

        await prisma.transactionHistory.create({
            data: {
                userId: Number(fromUser.id),
                amount: amount.toString(),
                transactionType: 'TRANSFER_OUT',
                description: `Transfer To ${toUser?.name}`,
                balanceBefore: fromBalance.amount,
                balanceAfter: (Number(fromBalance.amount) - Number(amount)).toString(),
                entryType: 'DEBIT',
                referenceId: null,
                createdAt: getCurrentDate()
            }
        });
        console.log("Sender transaction created");

        await prisma.transactionHistory.create({
            data: {
                userId: Number(toUser.id),
                amount: amount.toString(),
                transactionType: 'TRANSFER_IN',
                description: `Transfer from ${fromUser?.name}`,
                balanceBefore: toBalance.amount,
                balanceAfter: (Number(toBalance.amount) + Number(amount)).toString(),
                referenceId: null,
                entryType: 'CREDIT',
                createdAt: getCurrentDate()
            }
        });

        const sendSuccess = await fetch('http://localhost:5501/api/bank/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        console.log("Reveiver transaction created");
        console.log("------- Transfer Completed -------");

        return res.status(200).send({
            success: true,
            message: 'Transfer money successfully',
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

router.post('/p2ptransaction', async (req: Request, res: Response) => {
    const { toUserBankId, fromUserBankId, amount, transferId } = req.body;
    try {
        console.log("------- P2P Transaction Started -------");

        const { fromUser, toUser, fromUserBalance, toUserBalance } = await prisma.$transaction(async (tx: any) => {
            // Check if fromUser exists
            const fromUser = await tx.user.findUnique({
                where: { bankId: Number(fromUserBankId) }
            });

            const toUser = await tx.user.findUnique({
                where: { bankId: Number(toUserBankId) }
            });

            const fromUserBalance = await tx.balance.findUnique({
                where: { id: Number(fromUser.bankId) }
            });

            const toUserBalance = await tx.balance.findUnique({
                where: { id: Number(toUser.bankId) }
            });

            return { fromUser, toUser, fromUserBalance, toUserBalance };
        });

        if (!fromUser || !toUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        if (!fromUserBalance || !fromUserBalance) {
            return res.status(404).send({
                success: false,
                message: 'Balance not found'
            });
        }

        console.log(fromUserBalance, fromUserBalance);

        const transaction = await prisma.$transaction(async (tx: any) => {
            const sender = await tx.balance.update({
                where: {
                    userId: Number(fromUser.id)
                },
                data: {
                    amount: (Number(fromUserBalance.amount) - Number(amount)).toString(),
                    updatedAt: getCurrentDate()
                }
            });

            if (!sender) {
                throw new Error('Sender balance not updated');
            }
            if (Number(sender.amount) < 0) {
                throw new Error(`${fromUser.name} don't have enough balance`);
            }
            console.log("Sender balance updated");

            const receiver = await tx.balance.update({
                where: {
                    userId: Number(toUser.id)
                },
                data: {
                    amount: (Number(toUserBalance.amount) + Number(amount)).toString(),
                    updatedAt: getCurrentDate()
                }
            });

            console.log("receiver balance updated");
            await tx.transactionHistory.create({
                data: {
                    userId: Number(fromUser.id),
                    amount: amount.toString(),
                    transactionType: 'P2P_TRANSFER',
                    description: `Transfer To ${toUser?.name}`,
                    balanceBefore: (Number(sender.amount) + Number(amount)).toString(),
                    balanceAfter: Number(sender.amount).toString(),
                    referenceId: null,
                    entryType: 'DEBIT',
                    createdAt: getCurrentDate()
                }
            });
            console.log("Sender transaction history created");

            await tx.transactionHistory.create({
                data: {
                    userId: Number(toUser.id),
                    amount: amount.toString(),
                    transactionType: 'P2P_TRANSFER',
                    description: `Transfer from ${fromUser?.name}`,
                    balanceBefore: (Number(receiver.amount) - Number(amount)).toString(),
                    balanceAfter: Number(receiver.amount).toString(),
                    entryType: 'CREDIT',
                    referenceId: null,
                    createdAt: getCurrentDate()
                }
            });
            console.log("Reveiver transaction history created");
            console.log('Balance updated successfully');

            const token = sign({ success: true, transferId }, process.env.TOKEN_SECRET as string, { expiresIn: '1h' });

            await fetch('http://localhost:5501/api/p2ptransaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            return { sender, receiver };
        });
        console.log(transaction);

        return res.status(200).send({
            success: true,
            message: 'P2P Transaction Completed',
        });

    } catch (error) {
        const err = error as Error;
        console.log(err.message);

        const token = sign({ success: false, transferId }, process.env.TOKEN_SECRET as string, { expiresIn: '1h' });

        await fetch('http://localhost:5501/api/p2ptransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        res.status(500).send({
            success: false,
            message: err.message
        });
    }
});

export default router;
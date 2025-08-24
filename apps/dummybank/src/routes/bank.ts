import { Router, Request, Response } from 'express';
import { prisma } from '@repo/db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        // const balance = await prisma.balance.findUnique({
        //     where: { userId }
        // });
        // return balance !== null;
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
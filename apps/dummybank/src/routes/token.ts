import { Router, Request, Response } from 'express';
import { prisma } from '@repo/db';

const router = Router();

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

router.get('/', async (req: Request, res: Response) => {
    try {
        const param = req.query.token;
        console.log(req.query);
        res.send(param);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
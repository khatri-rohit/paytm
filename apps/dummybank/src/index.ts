import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bank from './routes/bank.js';

dotenv.config();

/*
    This is a dummy bank application that is used for testing purposes.
    It is not meant to be used in production.
    It is meant to be used as a reference for building a real banking application.
    This application is used to simulate a bank transfer.
*/

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug: Print environment variables
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

app.use('/api/bank', bank);
app.use('/api/transaction', bank);

app.get('/', (req: Request, res: Response) => {
    res.send(`<div style="font-size: 30px; font-weight: bold; background-color: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center;">
        <h1>Dummy Bank</h1>
    </div>`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
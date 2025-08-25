import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bank from './routes/bank.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug: Print environment variables
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

app.use('/api/bank', bank);

app.get('/', (req: Request, res: Response) => {
    res.send(`<div style="font-size: 30px; font-weight: bold; background-color: black; color: white; height: 100vh; display: flex; align-items: center; justify-content: center;">
        <h1>Dummy Bank</h1>
    </div>`);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function daysFromAgo(startDaysAgo: number, endDaysAgo = 0): Date[] {
    const dates: Date[] = [];
    for (let d = startDaysAgo; d >= endDaysAgo; d--) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - d);
        dates.push(date);
    }
    return dates;
}

function atTime(base: Date, hours: number, minutes = 0): Date {
    const dt = new Date(base);
    dt.setHours(hours, minutes, 0, 0);
    return dt;
}

function toAmountString(n: number) {
    return Math.round(n).toString();
}

async function main() {
    const targetIds = [1, 2];
    const existing = await prisma.user.findMany({ where: { id: { in: targetIds } }, select: { id: true } });
    const userIds = existing.map(u => u.id);

    if (userIds.length === 0) {
        console.warn('No target users (1,2) found. Skipping TransactionHistory seeding.');
        return;
    }

    // Generate dates from 10 days ago to today (inclusive)
    const dates = daysFromAgo(10, 0);

    const allData: any[] = [];

    for (const uid of userIds) {
        let balance = 10000; // starting balance for demo
        for (let i = 0; i < dates.length; i++) {
            const base = dates[i];

            // Credit in morning
            const creditAmt = 400 + (i % 7) * 50 + (uid === 1 ? 60 : 0);
            const creditType = i % 3 === 0 ? 'ON_RAMP' : 'TRANSFER_IN';
            const creditBefore = balance;
            const creditAfter = creditBefore + creditAmt;
            balance = creditAfter;

            allData.push({
                userId: uid,
                amount: toAmountString(creditAmt),
                transactionType: creditType as any,
                entryType: 'CREDIT' as any,
                description: creditType === 'ON_RAMP' ? 'On-ramp deposit' : 'Incoming transfer',
                balanceBefore: toAmountString(creditBefore),
                balanceAfter: toAmountString(creditAfter),
                referenceId: undefined,
                createdAt: atTime(base, 10),
            });

            // Debit in evening
            const maxDebit = Math.max(100, Math.floor(balance * 0.4));
            const debitAmt = Math.min(300 + (i % 5) * 40 + (uid === 2 ? 40 : 0), maxDebit);
            const debitType = i % 2 === 0 ? 'P2P_TRANSFER' : 'TRANSFER_OUT';
            const debitBefore = balance;
            const debitAfter = Math.max(0, debitBefore - debitAmt);
            balance = debitAfter;

            allData.push({
                userId: uid,
                amount: toAmountString(debitAmt),
                transactionType: debitType as any,
                entryType: 'DEBIT' as any,
                description: debitType === 'P2P_TRANSFER' ? 'Peer transfer' : 'Outgoing transfer',
                balanceBefore: toAmountString(debitBefore),
                balanceAfter: toAmountString(debitAfter),
                referenceId: undefined,
                createdAt: atTime(base, 17),
            });
        }
    }

    if (allData.length > 0) {
        // Optional: clear existing to avoid duplicates in demo environments
        // await prisma.transactionHistory.deleteMany({ where: { userId: { in: userIds } } });

        const result = await prisma.transactionHistory.createMany({ data: allData });
        console.log(`Inserted ${result.count} TransactionHistory rows for users ${userIds.join(', ')}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

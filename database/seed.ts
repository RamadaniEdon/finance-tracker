import { faker } from '@faker-js/faker';
import * as Crypto from 'expo-crypto';
import { db } from './db';
import { transactions, tags, transactionTags, NewTransaction, NewTransactionTag } from './tables/schema';
import { toSqliteTimestamp } from '@/utils/sqliteHelpers';

const TAGS = ['Food', 'Transport', 'Salary', 'Entertainment', 'Shopping', 'Health', 'Bills', 'Investment'];

export async function seedDatabase() {
    console.log('Starting database seed...');

    try {
        // 1. Clear existing data (optional, but good for clean slate)
        await db.delete(transactionTags);
        await db.delete(transactions);
        await db.delete(tags);

        // 2. Create Tags
        console.log('Creating tags...');
        await db.insert(tags).values(TAGS.map((name) => ({ name })));

        // 3. Create Transactions
        console.log('Creating transactions...');
        const newTransactions: NewTransaction[] = [];
        const newTransactionTags: NewTransactionTag[] = [];

        for (let i = 0; i < 50; i++) {
            const id = Crypto.randomUUID();
            const isExpense = faker.datatype.boolean();
            const type = isExpense ? 'EXPENSE' : 'INCOME';

            // Generate a date within the last 50 days
            const date = faker.date.recent({ days: 50 });

            const amount = parseFloat(faker.finance.amount({ min: 10, max: 1000, dec: 2 }));
            const finalAmount = isExpense ? -amount : amount;

            const description = isExpense ? faker.commerce.productName() : 'Salary or Income';

            newTransactions.push({
                id,
                amount: finalAmount,
                type: type as 'EXPENSE' | 'INCOME',
                description,
                transactionDate: toSqliteTimestamp(date),
            });

            // Assign 1-3 random tags
            const numTags = faker.number.int({ min: 1, max: 3 });
            const selectedTags = faker.helpers.arrayElements(TAGS, numTags);

            selectedTags.forEach((tagName) => {
                newTransactionTags.push({
                    transactionId: id,
                    tagName,
                });
            });
        }

        // Batch insert transactions
        // SQLite has limits on variables, so we might need to chunk if it was huge,
        // but 50 is fine.
        await db.insert(transactions).values(newTransactions);

        // Batch insert transaction tags
        await db.insert(transactionTags).values(newTransactionTags);

        console.log('Database seeded successfully!');
        return { success: true };
    } catch (error) {
        console.error('Error seeding database:', error);
        return { success: false, error };
    }
}

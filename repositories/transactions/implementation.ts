import { inArray, count, desc, sum, and, eq, gte, lte } from 'drizzle-orm';
import { db } from '@/database/db';
import { tags, transactions, transactionTags } from '@/database/tables/schema';
import { CreateTransaction, Transaction } from '@/domains/transactions/types';
import { TransactionRepository, PaginationParams, PaginatedResult } from './interface';
import { toSqliteTimestamp, fromSqliteTimestamp } from '@/utils/sqliteHelpers';
import * as Crypto from 'expo-crypto';

export class DrizzleTransactionRepository implements TransactionRepository {
    async getExistingTags(names: string[]): Promise<string[]> {
        if (names.length === 0) return [];
        const result = await db.select({ name: tags.name }).from(tags).where(inArray(tags.name, names));
        return result.map(t => t.name);
    }

    async createTags(names: string[]): Promise<void> {
        if (names.length === 0) return;
        await db.insert(tags).values(names.map(name => ({ name })));
    }

    async createTransaction(transaction: CreateTransaction): Promise<Transaction> {
        const id = Crypto.randomUUID();

        // Ensure amount is positive for logic check, then negate if expense
        const absoluteAmount = Math.abs(transaction.amount);
        const finalAmount = transaction.type === 'EXPENSE' ? -absoluteAmount : absoluteAmount;

        // Map domain entity to database record
        await db.insert(transactions).values({
            id,
            amount: finalAmount,
            type: transaction.type,
            description: transaction.description,
            transactionDate: toSqliteTimestamp(transaction.transactionDate),
        });

        // Return domain entity
        return {
            id,
            ...transaction,
            amount: absoluteAmount // Ensure returned entity has positive amount
        };
    }

    async addTransactionTags(transactionId: string, tagNames: string[]): Promise<void> {
        if (tagNames.length === 0) return;
        await db.insert(transactionTags).values(tagNames.map(tagName => ({
            transactionId,
            tagName
        })));
    }

    async getTransactions(params: PaginationParams): Promise<PaginatedResult<Transaction>> {
        const { page, limit } = params;
        const offset = (page - 1) * limit;

        const [totalCount] = await db.select({ count: count() }).from(transactions);
        const total = totalCount.count;
        const totalPages = Math.ceil(total / limit);

        const result = await db.query.transactions.findMany({
            limit,
            offset,
            orderBy: [desc(transactions.transactionDate)],
            with: {
                transactionTags: true
            }
        });

        const data = result.map(t => ({
            ...t,
            amount: Math.abs(t.amount),
            transactionDate: fromSqliteTimestamp(t.transactionDate),
            tags: t.transactionTags.map(tt => tt.tagName)
        }));

        return {
            data,
            total,
            totalPages,
            currentPage: page
        };
    }

    async getTransactionById(id: string): Promise<Transaction | null> {
        const result = await db.query.transactions.findFirst({
            where: (transactions, { eq }) => eq(transactions.id, id),
            with: {
                transactionTags: true
            }
        });

        if (!result) return null;

        return {
            ...result,
            amount: Math.abs(result.amount),
            transactionDate: fromSqliteTimestamp(result.transactionDate),
            tags: result.transactionTags.map(tt => tt.tagName)
        };
    }

    async getBalance(until?: Date): Promise<number> {
        const whereClause = until ? lte(transactions.transactionDate, toSqliteTimestamp(until)) : undefined;
        const res = await db.select({ balance: sum(transactions.amount) })
            .from(transactions)
            .where(whereClause);
        return Number(res[0]?.balance ?? 0);
    }

    async getIncome(startDate: Date, endDate: Date): Promise<number> {
        const res = await db.select({ total: sum(transactions.amount) })
            .from(transactions)
            .where(and(
                eq(transactions.type, 'INCOME'),
                gte(transactions.transactionDate, toSqliteTimestamp(startDate)),
                lte(transactions.transactionDate, toSqliteTimestamp(endDate))
            ));
        return Number(res[0]?.total ?? 0);
    }

    async getExpenses(startDate: Date, endDate: Date): Promise<number> {
        const res = await db.select({ total: sum(transactions.amount) })
            .from(transactions)
            .where(and(
                eq(transactions.type, 'EXPENSE'),
                gte(transactions.transactionDate, toSqliteTimestamp(startDate)),
                lte(transactions.transactionDate, toSqliteTimestamp(endDate))
            ));
        // Expenses are stored as negative, return absolute value
        return Math.abs(Number(res[0]?.total ?? 0));
    }
}

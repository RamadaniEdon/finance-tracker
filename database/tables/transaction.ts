import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { transactionTags } from './transactionTags';

export const transactions = sqliteTable("transactions", {
    id: text("id").primaryKey(),
    amount: real("amount").notNull(),
    type: text("type", { enum: ["EXPENSE", "INCOME"] }).notNull(),
    description: text("description").notNull(),
    transactionDate: text("transaction_date")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    createdAt: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: text("updated_at")
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const transactionsRelations = relations(transactions, ({ many }) => ({
    transactionTags: many(transactionTags),
}));

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
import { sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { transactions } from './transaction';
import { tags } from './tags';

export const transactionTags = sqliteTable(
    'transaction_tags',
    {
        transactionId: text('transaction_id')
            .notNull()
            .references(() => transactions.id, { onDelete: 'cascade' }),
        tagName: text('tag_name')
            .notNull()
            .references(() => tags.name, { onDelete: 'cascade' }),
        createdAt: text('created_at')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
        updatedAt: text('updated_at')
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [primaryKey({ columns: [table.transactionId, table.tagName] })],
);

export const transactionTagsRelations = relations(transactionTags, ({ one }) => ({
    transaction: one(transactions, {
        fields: [transactionTags.transactionId],
        references: [transactions.id],
    }),
    tag: one(tags, {
        fields: [transactionTags.tagName],
        references: [tags.name],
    }),
}));

export type TransactionTag = typeof transactionTags.$inferSelect;
export type NewTransactionTag = typeof transactionTags.$inferInsert;

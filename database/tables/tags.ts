import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { transactionTags } from './transactionTags';

export const tags = sqliteTable('tags', {
    name: text('name')
        .primaryKey()
        .notNull(),
    createdAt: text('created_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at')
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`)
});

export const tagsRelations = relations(tags, ({ many }) => ({
    transactionTags: many(transactionTags),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
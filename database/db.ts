import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './tables/schema';

const expo = SQLite.openDatabaseSync('finance-tracker.db');

export const expoDb = expo;

export const db = drizzle(expo, {
    schema
});


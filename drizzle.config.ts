import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'sqlite',
    driver: 'expo',
    schema: './database/tables/schema.ts',
    out: './database/drizzle',
});

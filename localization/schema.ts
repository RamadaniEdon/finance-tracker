import { z } from 'zod';

export const translationSchema = z.object(
    {
        language: z.string({ message: 'Language name is required to be string' }),
        common: z.object(
            {
                ok: z.string({ message: 'Ok message is required to be string' }),
                cancel: z.string({ message: 'Cancel message is required to be string' }),
                save: z.string({ message: 'Save message is required to be string' }),
                delete: z.string({ message: 'Delete message is required to be string' }),
                error: z.string({ message: 'Error message is required to be string' }),
                date: z.string({ message: 'Date message is required to be string' }),
                today: z.string({ message: 'Today message is required to be string' }),
            },
            { message: 'Common translations must be an object' },
        ),
        auth: z.object(
            {
                login: z.object(
                    {
                        title: z.string({ message: 'Login title is required to be string' }),
                        description: z.string({ message: 'Login description is required to be string' }),
                        actions: z.object(
                            {
                                login: z.string({ message: 'Login action is required to be string' }),
                                need_account: z.string({ message: 'Need account action is required to be string' }),
                            },
                            { message: 'Login actions must be an object' },
                        ),
                    },
                    { message: 'Login translations must be an object' },
                ),
            },
            { message: 'Auth translations must be an object' },
        ),
        transactions: z.object(
            {
                create: z.object({
                    title: z.string({ message: 'Create transaction title is required to be string' }),
                    amount: z.string({ message: 'Amount label is required to be string' }),
                    expense: z.string({ message: 'Expense label is required to be string' }),
                    income: z.string({ message: 'Income label is required to be string' }),
                    description: z.string({ message: 'Description label is required to be string' }),
                    description_placeholder: z.string({ message: 'Description placeholder is required to be string' }),
                    tags: z.string({ message: 'Tags label is required to be string' }),
                    tags_placeholder: z.string({ message: 'Tags placeholder is required to be string' }),
                    success: z.string({ message: 'Success message is required to be string' }),
                    save: z.string({ message: 'Save button label is required to be string' }),
                }, { message: 'Create transaction translations must be an object' }),
                list: z.object({
                    empty_title: z.string({ message: 'Empty list title is required to be string' }),
                    empty_description: z.string({ message: 'Empty list description is required to be string' }),
                }, { message: 'List transaction translations must be an object' }),
                details: z.object({
                    title: z.string({ message: 'Details title is required to be string' }),
                    not_found: z.string({ message: 'Not found message is required to be string' }),
                    go_back: z.string({ message: 'Go back button label is required to be string' }),
                    date_time: z.string({ message: 'Date & Time label is required to be string' }),
                    type: z.string({ message: 'Type label is required to be string' }),
                    tags: z.string({ message: 'Tags label is required to be string' }),
                }, { message: 'Transaction details translations must be an object' }),
            },
            { message: 'Transactions translations must be an object' }
        ),
        profile: z.object({
            title: z.string({ message: 'Profile title is required to be string' }),
            seed_db: z.string({ message: 'Seed DB button label is required to be string' }),
            seed_warning: z.string({ message: 'Seed warning is required to be string' }),
            language_toggle: z.string({ message: 'Language toggle button label is required to be string' }),
            current_language: z.string({ message: 'Current language label is required to be string' }),
        }, { message: 'Profile translations must be an object' }),
        tabs: z.object({
            home: z.string({ message: 'Home tab title is required to be string' }),
            create: z.string({ message: 'Create tab title is required to be string' }),
            profile: z.string({ message: 'Profile tab title is required to be string' }),
        }, { message: 'Tabs translations must be an object' }),
        home: z.object({
            title: z.string({ message: 'Home title is required to be string' }),
            subtitle: z.string({ message: 'Home subtitle is required to be string' }),
        }, { message: 'Home translations must be an object' }),
    },
    { message: 'Translation schema must be an object' },
);

export type Translation = z.infer<typeof translationSchema>;

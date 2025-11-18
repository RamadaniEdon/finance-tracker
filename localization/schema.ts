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
    },
    { message: 'Translation schema must be an object' },
);

export type Translation = z.infer<typeof translationSchema>;

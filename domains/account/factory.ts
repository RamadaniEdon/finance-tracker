import { z } from 'zod';

export const accountSchema = z.object({
    balance: z.number({ message: 'Balance must be a number' }),
});
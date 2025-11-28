import { DrizzleTransactionRepository } from '@/repositories/transactions/implementation';

export interface TagExpenseAnalytics {
    tagName: string;
    total: number;
    averagePerMonth: number;
    percentage: number;
}

export async function getExpensesByTagUseCase(startDate: Date, endDate: Date): Promise<TagExpenseAnalytics[]> {
    const repository = new DrizzleTransactionRepository();

    const expensesByTag = await repository.getExpensesByTag(startDate, endDate);

    const totalExpenses = expensesByTag.reduce((sum, item) => sum + item.total, 0);

    // Calculate number of months in the range
    // We treat partial months as full months for simplicity or use exact day difference
    // For "average per month", exact day difference / 30 might be better, or just difference in months
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Avoid division by zero, min 1 month equivalent
    const months = Math.max(1, diffDays / 30);

    return expensesByTag.map((item) => ({
        tagName: item.tagName,
        total: item.total,
        averagePerMonth: item.total / months,
        percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0,
    }));
}

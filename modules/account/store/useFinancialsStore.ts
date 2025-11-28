import { create } from 'zustand';
import { PeriodFinancials, getPeriodFinancialsUseCase } from '@/use-cases/account/getPeriodFinancials';

interface FinancialsState {
    currentPeriod: PeriodFinancials | null;
    previousPeriod: PeriodFinancials | null;
    loading: boolean;
    error: string | null;
    fetchFinancials: (currentStart: Date, currentEnd: Date, previousStart: Date, previousEnd: Date) => Promise<void>;
}

export const useFinancialsStore = create<FinancialsState>((set) => ({
    currentPeriod: null,
    previousPeriod: null,
    loading: false,
    error: null,
    fetchFinancials: async (currentStart, currentEnd, previousStart, previousEnd) => {
        set({ loading: true, error: null });
        try {
            const [currentPeriod, previousPeriod] = await Promise.all([
                getPeriodFinancialsUseCase(currentStart, currentEnd),
                getPeriodFinancialsUseCase(previousStart, previousEnd)
            ]);
            set({ currentPeriod, previousPeriod, loading: false });
        } catch (error) {
            set({ error: 'Failed to fetch financials', loading: false });
        }
    }
}));

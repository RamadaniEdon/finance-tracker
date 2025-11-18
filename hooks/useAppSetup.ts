import { useInitializeTranslation } from './useInitializeTranslation';
import { useSyncTheme } from './useSyncTheme';

export function useAppSetup() {
    useSyncTheme();
    const { ready } = useInitializeTranslation();

    return { ready };
}

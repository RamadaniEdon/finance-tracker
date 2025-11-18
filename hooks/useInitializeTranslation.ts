import { useLocaleStore } from '@/store/useLocaleStore';
import { useEffect } from 'react';

export function useInitializeTranslation() {
    const { translations, loadTranslation } = useLocaleStore();

    useEffect(() => {
        loadTranslation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { ready: translations !== null };
}

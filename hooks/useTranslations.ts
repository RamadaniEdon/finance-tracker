import { useLocaleStore } from '@/store/useLocaleStore';

export function useTranslations() {
    const { languageChoice, translations, setLanguageChoice } = useLocaleStore();

    return { languageChoice, translations: translations as NonNullable<typeof translations>, setLanguageChoice };
}

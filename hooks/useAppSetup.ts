import { expoDb, db } from '@/database/db';
import { useInitializeTranslation } from './useInitializeTranslation';
import { useSyncTheme } from './useSyncTheme';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/database/drizzle/migrations';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

export function useAppSetup() {
    useMigrations(db, migrations);
    useDrizzleStudio(expoDb);
    useSyncTheme();
    const { ready } = useInitializeTranslation();

    return { ready };
}

import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from '@/hooks/useTranslations';
import { Button, Text, View } from 'react-native';

export default function Index() {
    const theme = useTheme();
    const { languageChoice, setLanguageChoice, translations } = useTranslations();
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-foreground">{translations?.language}</Text>
            <Button
                color={theme.colors.text}
                title={translations?.auth.login.title}
                onPress={() => setLanguageChoice(languageChoice === 'en' ? 'al' : 'en')}
            />
        </View>
    );
}

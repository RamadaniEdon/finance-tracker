import { Tabs, useRouter } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslations } from '@/hooks/useTranslations';

export default function TabLayout() {
    const theme = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useTranslations();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                    height: 54 + insets.bottom,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.subtext,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: t.tabs.home,
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="analytics"
                options={{
                    title: t.tabs.analytics,
                    tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="add"
                options={{
                    title: t.tabs.create,
                    tabBarButton: () => (
                        <View className="items-center justify-center -mt-8">
                            <TouchableOpacity
                                onPress={() => router.push('/create-transaction')}
                                className="bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg"
                                activeOpacity={0.9}
                            >
                                <Ionicons name="add" size={32} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: t.tabs.profile,
                    tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

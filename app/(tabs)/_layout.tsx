import { Tabs, useRouter } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
    const theme = useTheme();
    const router = useRouter();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.subtext,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            {/* Placeholder for the middle button */}
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Create Transaction',
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
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

import React from 'react';
import { FlatList, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionItem } from './TransactionItem';

export const TransactionList: React.FC = () => {
    const theme = useTheme();
    const {
        transactions,
        loading,
        hasMore,
        loadMore,
        refresh
    } = useTransactions();

    const renderFooter = () => {
        if (!loading) return <View className="h-20" />;
        return (
            <View className="py-4 h-20">
                <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (loading && transactions.length === 0) {
            return (
                <View className="flex-1 justify-center items-center py-20">
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }

        if (!loading && transactions.length === 0) {
            return (
                <View className="flex-1 justify-center items-center py-20 px-4">
                    <Text
                        className="text-lg font-medium text-center mb-2"
                        style={{ color: theme.colors.text }}
                    >
                        No transactions yet
                    </Text>
                    <Text
                        className="text-sm text-center"
                        style={{ color: theme.colors.subtext }}
                    >
                        Start by adding your first transaction!
                    </Text>
                </View>
            );
        }
        return null;
    };

    return (
        <FlatList
            data={transactions}
            renderItem={({ item }) => <TransactionItem transaction={item} />}
            keyExtractor={(item) => item.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={{ paddingVertical: 16, flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={loading && transactions.length === 0}
                    onRefresh={refresh}
                    tintColor={theme.colors.primary}
                    colors={[theme.colors.primary]}
                />
            }
        />
    );
};

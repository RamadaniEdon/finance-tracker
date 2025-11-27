import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CreateTransaction, TransactionType } from '@/domains/transactions/types';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { useRouter } from 'expo-router';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import { useTranslations } from '@/hooks/useTranslations';
import { CustomDateTimePicker } from './DateTimePicker';

export function CreateTransactionForm() {
    const theme = useTheme();
    const router = useRouter();

    const { t } = useTranslations();

    const [createTransaction, { data, loading, error }] = useCreateTransaction({
        onCompleted: (data) => {
            console.log(data);
            setTimeout(() => {
                router.back();
            }, 1500);
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const isSuccess = !loading && !error && !!data;

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [description, setDescription] = useState('');
    const [type, setType] = useState<TransactionType>('INCOME');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleExpensePress = () => {
        setType('EXPENSE');
    };

    const handleIncomePress = () => {
        setType('INCOME');
    };

    const handleCreateTransaction = () => {
        if (loading) return;

        const transaction: CreateTransaction = {
            amount: Number(amount),
            type,
            description,
            tags,
            transactionDate: date,
        }
        createTransaction(transaction);
    }

    return (
        <ScrollView className="flex-1 bg-background p-4" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Amount Input */}
            <View className="mb-8 items-center">
                <Text className="text-subtext mb-2 text-lg">{t.transactions.create.amount}</Text>
                <View className="flex-row items-center">
                    <Text className={cn('text-4xl font-bold', type === 'EXPENSE' ? 'text-expense' : 'text-income')}>$</Text>
                    <TextInput
                        className={cn('text-5xl font-bold min-w-[100px] text-center', type === 'EXPENSE' ? 'text-expense' : 'text-income')}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={type === 'EXPENSE' ? theme.colors.expense : theme.colors.income}
                    />
                </View>
            </View>

            {/* Type Selector */}
            <View className="flex-row mb-6 bg-card rounded-2xl p-1">
                <Pressable
                    className={cn('flex-1 py-3 rounded-xl items-center', type === 'EXPENSE' && 'bg-background')}
                    onPress={() => handleExpensePress()}
                >
                    <Text className={cn('font-semibold', type === 'EXPENSE' ? 'text-expense' : 'text-subtext')}>{t.transactions.create.expense}</Text>
                </Pressable>
                <Pressable
                    className={cn('flex-1 py-3 rounded-xl items-center', type === 'INCOME' && 'bg-background')}
                    onPress={() => handleIncomePress()}
                >
                    <Text className={cn('font-semibold', type === 'INCOME' ? 'text-income' : 'text-subtext')}>{t.transactions.create.income}</Text>
                </Pressable>
            </View>

            {/* Date Picker */}
            <CustomDateTimePicker date={date} onChange={setDate} />

            {/* Description */}
            <View className="mb-6">
                <Text className="text-subtext mb-2 font-medium">{t.transactions.create.description}</Text>
                <TextInput
                    className="bg-card text-foreground p-4 rounded-2xl text-lg"
                    value={description}
                    onChangeText={setDescription}
                    placeholder={t.transactions.create.description_placeholder}
                    placeholderTextColor={theme.colors.text}
                />
            </View>

            {/* Tags */}
            <View className="mb-6">
                <Text className="text-subtext mb-2 font-medium">{t.transactions.create.tags}</Text>
                <View className="flex-row flex-wrap gap-2 mb-3">
                    {tags.map(tag => (
                        <Pressable
                            key={tag}
                            onPress={() => removeTag(tag)}
                            className="bg-card px-3 py-1 rounded-full flex-row items-center border border-border"
                        >
                            <Text className="text-foreground mr-1">#{tag}</Text>
                            <Ionicons name="close-circle" size={16} color={theme.colors.text} />
                        </Pressable>
                    ))}
                </View>
                <View className="flex-row items-center bg-card rounded-2xl px-4">
                    <Ionicons name="pricetag-outline" size={20} color={theme.colors.text} />
                    <TextInput
                        className="flex-1 p-4 text-foreground text-lg"
                        value={currentTag}
                        onChangeText={setCurrentTag}
                        onSubmitEditing={handleAddTag}
                        placeholder={t.transactions.create.tags_placeholder}
                        placeholderTextColor={theme.colors.text}
                        returnKeyType="done"
                    />
                    <Pressable onPress={handleAddTag}>
                        <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                    </Pressable>
                </View>
            </View>

            {/* Submit Button */}
            <Pressable
                className={cn(
                    "py-4 rounded-2xl items-center shadow-lg mt-4",
                    isSuccess ? "bg-green-500" : "bg-primary"
                )}
                onPress={handleCreateTransaction}
                disabled={loading || isSuccess}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : isSuccess ? (
                    <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={24} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-xl ml-2">{t.transactions.create.success}</Text>
                    </View>
                ) : (
                    <Text className="text-white font-bold text-xl">{t.transactions.create.save}</Text>
                )}
            </Pressable>
        </ScrollView>
    );
}

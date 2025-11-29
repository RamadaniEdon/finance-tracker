import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CreateTransaction, TransactionType } from '@/domains/transactions/types';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/utils/cn';
import { useRouter } from 'expo-router';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import { useTranslations } from '@/hooks/useTranslations';
import { CustomDateTimePicker } from '@/components/DateTimePicker';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';

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
        },
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
        setTags(tags.filter((tag) => tag !== tagToRemove));
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
        };
        createTransaction(transaction);
    };

    return (
        <ScrollView className="flex-1 bg-background p-4" contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Amount Input */}
            <View className="mb-8 items-center">
                <Text className="text-subtext mb-2 text-lg">{t.transactions.create.amount}</Text>
                <View className="flex-row items-center">
                    <Text className={cn('text-4xl font-bold', type === 'EXPENSE' ? 'text-expense' : 'text-income')}>
                        $
                    </Text>
                    <TextInput
                        className={cn(
                            'text-5xl font-bold min-w-[100px] text-center',
                            type === 'EXPENSE' ? 'text-expense' : 'text-income',
                        )}
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
                    <Text className={cn('font-semibold', type === 'EXPENSE' ? 'text-expense' : 'text-subtext')}>
                        {t.transactions.create.expense}
                    </Text>
                </Pressable>
                <Pressable
                    className={cn('flex-1 py-3 rounded-xl items-center', type === 'INCOME' && 'bg-background')}
                    onPress={() => handleIncomePress()}
                >
                    <Text className={cn('font-semibold', type === 'INCOME' ? 'text-income' : 'text-subtext')}>
                        {t.transactions.create.income}
                    </Text>
                </Pressable>
            </View>

            {/* Date Picker */}
            <CustomDateTimePicker date={date} onChange={setDate} />

            {/* Description */}
            <Input
                label={t.transactions.create.description}
                value={description}
                onChangeText={setDescription}
                placeholder={t.transactions.create.description_placeholder}
            />

            {/* Tags */}
            <View className="mb-6">
                <Text className="text-subtext mb-2 font-medium">{t.transactions.create.tags}</Text>
                <View className="flex-row flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                        <Badge key={tag} label={`#${tag}`} onRemove={() => removeTag(tag)} />
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
            <Button
                title={isSuccess ? t.transactions.create.success : t.transactions.create.save}
                onPress={handleCreateTransaction}
                loading={loading}
                disabled={isSuccess}
                variant={isSuccess ? 'success' : 'primary'}
                icon={isSuccess ? 'checkmark-circle' : undefined}
                className="mt-4"
            />
        </ScrollView>
    );
}

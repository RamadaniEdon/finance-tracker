import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslations } from '@/hooks/useTranslations';

interface CustomDateTimePickerProps {
    date: Date;
    onChange: (date: Date) => void;
    label?: string;
}

export function CustomDateTimePicker({ date, onChange, label }: CustomDateTimePickerProps) {
    const theme = useTheme();
    const { t } = useTranslations();
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowPicker(false);
        }
        if (selectedDate) {
            onChange(selectedDate);
        }
    };

    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    return (
        <View className="mb-6">
            <Text className="text-subtext mb-2 font-medium">{label || t.common.date}</Text>
            <Pressable
                onPress={togglePicker}
                className="bg-card flex-row items-center justify-between p-4 rounded-2xl border border-border"
            >
                <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} className="mr-3" />
                    <Text className="text-foreground text-lg font-medium">
                        {isToday(date) ? t.common.today : formatDate(date)}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={theme.colors.subtext} />
            </Pressable>

            {/* Android Picker */}
            {Platform.OS === 'android' && showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={handleChange}
                />
            )}

            {/* iOS Picker - Inline */}
            {Platform.OS === 'ios' && showPicker && (
                <View className="mt-2 rounded-2xl overflow-hidden items-center w-full">
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        display="inline"
                        onChange={handleChange}
                    />
                </View>
            )}
        </View>
    );
}

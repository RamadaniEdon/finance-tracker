import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerClassName?: string;
}

export function Input({
    label,
    error,
    containerClassName,
    className,
    ...props
}: InputProps) {
    const theme = useTheme();

    return (
        <View className={cn("mb-4", containerClassName)}>
            {label && (
                <Text className="text-subtext mb-2 font-medium">{label}</Text>
            )}
            <TextInput
                className={cn(
                    "bg-card text-foreground p-4 rounded-2xl text-lg border border-transparent focus:border-primary",
                    error && "border-red-500",
                    className
                )}
                placeholderTextColor={theme.colors.subtext}
                {...props}
            />
            {error && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
}

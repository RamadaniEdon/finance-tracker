import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface CardProps extends ViewProps {
    variant?: 'default' | 'primary' | 'outlined';
}

export function Card({ children, className, style, variant = 'default', ...props }: CardProps) {
    const theme = useTheme();

    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary':
                return theme.colors.primary;
            case 'default':
            default:
                return theme.colors.card;
        }
    };

    return (
        <View
            className={cn(
                'p-4 rounded-2xl shadow-sm',
                variant === 'outlined' && 'border border-border bg-transparent',
                className,
            )}
            style={[variant !== 'outlined' && { backgroundColor: getBackgroundColor() }, style]}
            {...props}
        >
            {children}
        </View>
    );
}
